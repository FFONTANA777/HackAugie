# Conductor Backend

FastAPI backend exposing two Conductor instances for the Design Intent Engine demo.

## Files

```
main.py              — FastAPI app, routes, input normalization
reward_conductor.py  — Shop/offer curation conductor
path_conductor.py    — Event queue / leg pacing conductor
conductor.py         — Your existing Conductor + LLMScorer
```

---

## Setup

```bash
pip install fastapi uvicorn pydantic httpx
uvicorn main:app --reload --port 8000
```

Wire in your scorer in `main.py`:
```python
from conductor import LLMScorer
scorer = LLMScorer(api_key="YOUR_GEMINI_KEY")
```

---

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness check |
| GET | `/describe/reward` | Reward conductor config |
| GET | `/describe/path` | Path conductor config |
| POST | `/reward` | Curate shop slots |
| POST | `/path` | Reorder encounter queue |

---

## JS Integration Points

### `/reward` — call at `arriveAtCheckpoint()`

Replace the `shopInventory` generation in `gameObject.arriveAtCheckpoint()`:

```js
// Before (random)
shopInventory: generateShopInventoryRandom().map(slot => ({
    ...slot,
    displayPrice: getBuyPrice(slot.price, this)
}))

// After (conductor-curated)
const candidates = generateShopInventoryRandom()
const res = await fetch("http://localhost:8000/reward", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        player: {
            gold: this.player.gold,
            food: this.player.food,
            merchandise: this.player.merchandise,
            consumables: this.player.consumables,
            relics: this.player.relic,
            buffs: this.player.buffs,
            debuffs: this.player.debuffs,
            decks: this.player.decks,
            sell_count: this.player.sellCount,
            towns_visited: this.player.townsVisited,
            chosen_set: this.player.chosenSet,
            decision_history: this.player.decisionHistory
        },
        candidates: candidates
    })
})
const { ranked } = await res.json()
shopInventory = ranked.map(slot => ({
    ...slot,
    displayPrice: getBuyPrice(slot.price, this)
}))
```

> Note: `arriveAtCheckpoint()` will need to become `async` for this to work.

---

### `/path` — call at `startLeg()`

Replace `generateEncounterQueue()` in `gameObject.startLeg()`:

```js
// Before (random)
this.gameState.currentLeg.eventQueue = generateEncounterQueue(pathOption.eventDensity)

// After (conductor-paced)
const rawQueue = generateEncounterQueue(pathOption.eventDensity)
// Map queue strings to candidate objects with IDs for the conductor
const candidates = rawQueue.map((encounterId, i) => ({
    id: `${encounterId}_${i}`,
    encounter_id: encounterId,
    position_hint: i   // original random position — conductor can use or ignore
}))

const res = await fetch("http://localhost:8000/path", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        player: { /* same shape as reward */ },
        game_state: {
            legs_remaining: this.gameState.legsRemaining,
            current_leg: this.gameState.currentLeg
        },
        path_type: pathOption.type,
        candidates: candidates
    })
})
const { ranked } = await res.json()
// Unpack back to the string IDs the game expects
this.gameState.currentLeg.eventQueue = ranked.map(c => c.encounter_id)
```

> Note: `startLeg()` will need to become `async` for this to work.

---

## Live Demo — Swapping Intent

Both endpoints accept an `intent_override` field. Use this in the demo's
3-column comparison view to swap between no-engine, mechanical intent,
and creative intent without restarting the server:

```js
// Column 2 — mechanical
body: JSON.stringify({
    ...basePayload,
    intent_override: "Surface one item the player can afford and one they can't quite afford yet."
})

// Column 3 — creative
body: JSON.stringify({
    ...basePayload,
    intent_override: "Half the offers should deepen their current set strategy. Half should be compelling pivots that make a new direction feel viable."
})
```

---

## Decision History Vocabulary

`logDecision()` strings the conductor's archetype inference reads:

| String | When to log |
|--------|-------------|
| `"chose_short_path"` | Player picks short path |
| `"chose_medium_path"` | Player picks medium path |
| `"chose_long_path"` | Player picks long path |
| `"bought_food"` | Player buys food at shop |
| `"bought_consumable"` | Player buys consumable at shop |
| `"bought_merch"` | Player buys merchandise at shop |
| `"bought_set_card"` | Purchased merch completes/extends a set |
| `"bought_rare_merch"` | Purchased merch is rare/epic/legendary |
| `"sold_merchandise"` | Player sells a card |
| `"sold_off_set_card"` | Sold card was part of an active set |
| `"used_consumable"` | Player uses a consumable in an encounter |
| `"skipped_offer"` | Player declines all shop purchases |
| `"upgraded_merch_deck"` | Player upgrades wagon |
| `"skipped_merch"` | Player skips available merch purchase |
| `"skipped_cheap_card"` | Player skips a common/uncommon card |

Wire these into `gameObject.logDecision()` calls at the relevant UI actions.
