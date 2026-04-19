"""
path_conductor.py
Builds and returns a configured Conductor instance for event queue / leg pacing.

The path conductor's job:
  Given a player's state and the path type they chose (short/medium/long),
  reorder a randomly-generated encounter queue so the pacing of that leg
  executes the designer's intent — not just a random ordering.

Unlike the reward conductor, this isn't about filtering out bad options.
Every encounter in the queue is valid. The job here is *sequencing*:
which encounters should the player hit first vs. last on this leg,
given their current food, gold, relic loadout, and playstyle?

Designer intent is set here but can be overridden per-request for the live demo.
"""

from conductor import Conductor


DEFAULT_PATH_INTENT = """
I want each leg of the journey to feel like it has a shape — a beginning,
a middle, and a payoff — rather than a random sequence of events.

If the player's merchandise inventory is empty, prioritize encounters that
grant free or discounted merchandise early in the leg. An empty inventory
severely limits the player's options — getting them something to carry and
sell should be the first priority before anything else.

Early in a leg, surface encounters that are low-stakes and establish context:
merchant sightings, weather events, easy trades, flavor moments. These let the
player settle in and plan.

In the middle of a leg, raise the stakes: encounters that require a real decision,
that cost something or offer something meaningful. The player should feel the
journey getting harder.

Near the end of a leg, surface the biggest encounter — the one with the most
potential upside or the most dangerous risk. The player should feel earned
relief or earned reward when the checkpoint comes into view.

For a player who is low on food (food_surplus near 0), front-load any
food-granting encounters so they don't die before the payoff.

For a player with buffs active, place high-value trade encounters while the
buff is relevant — don't waste the buff on filler events.

For cautious players (short path chosen, high food hoarding in history),
soften the mid-leg spike slightly — the tension should still be there but
shouldn't feel punishing.
"""


# Archetype signals mirror the reward conductor — same decision_history vocabulary
PATH_ARCHETYPES = {
    "risk_taker": {
        "description": "Chooses long paths, engages dangerous encounters, high variance player",
        "signals": {
            "chose_long_path":        1.0,
            "chose_medium_path":      0.3,
            "chose_short_path":      -0.5,
            "skipped_offer":         -0.2,
            "bought_rare_merch":      0.4,
        }
    },
    "cautious_traveler": {
        "description": "Hoards food, avoids risk, takes safe paths",
        "signals": {
            "chose_short_path":       1.0,
            "bought_food":            0.8,
            "skipped_offer":          0.5,
            "chose_long_path":       -0.3,
        }
    },
    "opportunist": {
        "description": "Engages every event, tries to extract maximum value from each leg",
        "signals": {
            "bought_consumable":      0.6,
            "bought_merch":           0.6,
            "chose_medium_path":      0.5,
            "used_consumable":        0.7,
            "skipped_offer":         -0.4,
        }
    }
}


def build_path_conductor(scorer) -> Conductor:
    c = Conductor(scorer=scorer)

    # -------- Register archetypes --------
    for name, arch in PATH_ARCHETYPES.items():
        c.register_archetype(name, arch["description"], arch["signals"])

    # -------- Register inputs --------
    # These mirror the keys produced by _player_to_path_inputs() in main.py
    c.register_input("gold",             int,   "Player's current gold")
    c.register_input("food",             int,   "Player's current food supply")
    c.register_input("food_surplus",     float, "Food above minimum path cost — 0.0 means the player is tight")
    c.register_input("legs_remaining",   int,   "Legs left before the final checkpoint")
    c.register_input("path_type",        str,   "Path length chosen: short | medium | long")
    c.register_input("buff_total",       int,   "Sum of all active buff values")
    c.register_input("debuff_total",     int,   "Sum of all active debuff values")
    c.register_input("relic_effects",    list,  "Effect keys of equipped relics")
    c.register_input("merchandise",      list,  "IDs of cards currently in merch deck")
    c.register_input("towns_visited",    int,   "Towns visited this run")
    c.register_input("decision_history", list,  "Ordered log of player decisions this run")

    # -------- Register outputs --------
    # The conductor returns a reordered version of the encounter queue.
    # Index 0 fires first on the leg; last index fires just before the checkpoint.
    c.register_output("encounter", list, "Reordered encounter queue; index 0 is the first encounter the player hits")

    # -------- Set intent --------
    c.set_intent(DEFAULT_PATH_INTENT)

    return c
