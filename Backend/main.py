"""
Conductor Backend — Design Intent Engine
FastAPI server exposing two Conductor instances:
  - /reward    → shop/offer curation
  - /path      → event queue / leg composition
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Any
import json

from conductor import Conductor, LLMScorer
from reward_conductor import build_reward_conductor
from path_conductor import build_path_conductor

app = FastAPI(title="Conductor Engine", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # tighten in prod
    allow_methods=["*"],
    allow_headers=["*"],
)

# ========================
# Instantiate Conductors
# ========================
# Both share a scorer. Swap LLMScorer for MLScorer here in stage 2/3.
# scorer = LLMScorer(api_key="YOUR_KEY_HERE")
scorer = None  # replace with LLMScorer(api_key=...) — see README

reward_conductor = build_reward_conductor(scorer)
path_conductor   = build_path_conductor(scorer)


# ========================
# Request / Response Models
# ========================

class PlayerState(BaseModel):
    gold: int
    food: int
    merchandise: list[dict]      # [{ id, name, rarity, set?, ... }]
    consumables: list[dict]
    relics: list[dict]           # [{ id, effect, ... }]
    buffs: list[dict]            # [{ id, value, duration }]
    debuffs: list[dict]
    decks: dict                  # { merchandise: int, consumables: int, relics: int }
    sell_count: int
    towns_visited: int
    chosen_set: str | None
    decision_history: list[str]

class GameState(BaseModel):
    legs_remaining: int
    current_leg: dict            # { daysToNextTown, eventQueue }

class RewardRequest(BaseModel):
    player: PlayerState
    candidates: list[dict]       # pre-generated shop slots from generateShopInventoryRandom()
    intent_override: str | None = None  # lets the demo swap intent live

class PathRequest(BaseModel):
    player: PlayerState
    game_state: GameState
    path_type: str               # "short" | "medium" | "long"
    candidates: list[dict]       # pre-generated encounter pool from generateEncounterQueue()
    intent_override: str | None = None

class ConductorResponse(BaseModel):
    ranked: list[dict]
    debug: dict | None = None    # conductor.describe() + archetype inference


# ========================
# Routes
# ========================

@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/describe/reward")
def describe_reward():
    """Returns the reward conductor's current config — useful for the demo UI."""
    return reward_conductor.describe()


@app.get("/describe/path")
def describe_path():
    """Returns the path conductor's current config."""
    return path_conductor.describe()


@app.post("/reward", response_model=ConductorResponse)
def curate_reward(req: RewardRequest):
    """
    Given a player state and a candidate pool of shop slots,
    returns the pool ranked by how well each slot executes the designer's
    reward intent for this specific player.

    The JS side calls this at arriveAtCheckpoint() before rendering the shop.
    Pass the output of generateShopInventoryRandom() as `candidates`.
    """
    if req.intent_override:
        reward_conductor.set_intent(req.intent_override)

    inputs = _player_to_reward_inputs(req.player)

    try:
        ranked = reward_conductor.execute(inputs, req.candidates)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return ConductorResponse(
        ranked=ranked,
        debug=reward_conductor.describe()
    )


@app.post("/path", response_model=ConductorResponse)
def curate_path(req: PathRequest):
    """
    Given player state, game state, path type, and a candidate encounter pool,
    returns the pool ranked/reordered by pacing intent.

    The JS side calls this inside startLeg() before setting eventQueue.
    Pass the output of generateEncounterQueue(eventDensity) as `candidates`.
    """
    if req.intent_override:
        path_conductor.set_intent(req.intent_override)

    inputs = _player_to_path_inputs(req.player, req.game_state, req.path_type)

    try:
        ranked = path_conductor.execute(inputs, req.candidates)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return ConductorResponse(
        ranked=ranked,
        debug=path_conductor.describe()
    )


# ========================
# Input Normalization Helpers
# ========================
# These translate the JS gameObject shape into the flat dicts
# that each conductor's registered inputs expect.

def _player_to_reward_inputs(p: PlayerState) -> dict:
    merch_slots_used  = len(p.merchandise)
    merch_slots_total = p.decks.get("merchandise", 6)
    cons_slots_used   = len(p.consumables)
    cons_slots_total  = p.decks.get("consumables", 2)

    relic_ids    = [r["id"] for r in p.relics]
    relic_effects = [r.get("effect", "") for r in p.relics]

    # What sets does the player currently have cards from?
    active_sets = list({c["set"] for c in p.merchandise if c.get("set")})

    # How full is the merch deck, as a 0-1 float?
    merch_fullness = merch_slots_used / merch_slots_total if merch_slots_total else 0.0

    return {
        "gold":             p.gold,
        "food":             p.food,
        "merchandise":      [c["id"] for c in p.merchandise],
        "consumables":      [c["id"] for c in p.consumables],
        "relic_ids":        relic_ids,
        "relic_effects":    relic_effects,
        "active_sets":      active_sets,
        "merch_fullness":   merch_fullness,
        "merch_slots_free": merch_slots_total - merch_slots_used,
        "cons_slots_free":  cons_slots_total  - cons_slots_used,
        "sell_count":       p.sell_count,
        "towns_visited":    p.towns_visited,
        "chosen_set":       p.chosen_set or "",
        "decision_history": p.decision_history,
    }


def _player_to_path_inputs(p: PlayerState, g: GameState, path_type: str) -> dict:
    buff_total   = sum(b["value"] for b in p.buffs)
    debuff_total = sum(d["value"] for d in p.debuffs)

    # Rough food surplus: food minus minimum expected path cost
    path_min_cost = {"short": 2, "medium": 3, "long": 5}
    food_surplus  = p.food - path_min_cost.get(path_type, 3)

    relic_effects = [r.get("effect", "") for r in p.relics]

    return {
        "gold":             p.gold,
        "food":             p.food,
        "food_surplus":     float(max(food_surplus, 0)),
        "legs_remaining":   g.legs_remaining,
        "path_type":        path_type,
        "buff_total":       buff_total,
        "debuff_total":     debuff_total,
        "relic_effects":    relic_effects,
        "merchandise":      [c["id"] for c in p.merchandise],
        "towns_visited":    p.towns_visited,
        "decision_history": p.decision_history,
    }
