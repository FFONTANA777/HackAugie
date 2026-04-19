"""
reward_conductor.py
Builds and returns a configured Conductor instance for shop/offer curation.

The reward conductor's job:
  Given a player's current state (what they're carrying, how full their deck is,
  what relics they have, what sets they're chasing), rank a candidate pool of
  shop slots so the ones that most meaningfully execute the designer's reward
  intent surface first.

Designer intent is set here but can be overridden per-request via the API
(useful for the live demo — swap intent and watch the output shift).
"""

from conductor import Conductor


DEFAULT_REWARD_INTENT = """
I want every shop visit to feel like a real decision — not noise.

Half the offers should reinforce what the player is already building toward:
if they're chasing a set, surface cards that complete it; if their consumable
slots are empty, surface items that patch that gap; if they're flush with gold,
surface higher-rarity merchandise worth the spend.

Half the offers should be tempting pivots: cards from a different high-value set
they're not currently running, a relic-synergistic consumable they don't have,
something that opens a new strategy without being obviously better than what
they already have.

Never surface items the player literally cannot buy (gold check) or cannot hold
(deck full). Never surface duplicates of what they're already carrying.

For a player late in their run (low legs remaining), weight toward completing
sets over expanding into new ones — closing out is better than starting fresh.
"""

# Archetype signals: decision_history entries → archetype weights
# These map JS logDecision() strings to archetype names.
# Add more as you wire up logDecision() calls in the game.
REWARD_ARCHETYPES = {
    "set_collector": {
        "description": "Prioritizes completing card sets for sell bonuses",
        "signals": {
            "bought_set_card":        1.0,
            "sold_off_set_card":     -0.5,
            "chose_long_path":        0.2,   # willing to take risk for upside
            "bought_consumable":      0.0,
            "skipped_cheap_card":     0.3,   # selective, waiting for the right card
        }
    },
    "consumable_runner": {
        "description": "Leans on consumables to handle encounters, keeps merch lean",
        "signals": {
            "bought_consumable":      1.0,
            "used_consumable":        0.8,
            "skipped_merch":          0.5,
            "chose_short_path":       0.3,   # conserves food, travels light
        }
    },
    "gold_maximizer": {
        "description": "Sells aggressively, buys and flips high-value merch",
        "signals": {
            "sold_merchandise":       0.8,
            "bought_rare_merch":      0.7,
            "upgraded_merch_deck":    0.6,
            "skipped_cheap_card":     0.4,
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
    }
}


def build_reward_conductor(scorer) -> Conductor:
    c = Conductor(scorer=scorer)

    # -------- Register archetypes --------
    for name, arch in REWARD_ARCHETYPES.items():
        c.register_archetype(name, arch["description"], arch["signals"])

    # -------- Register inputs --------
    # These mirror the keys produced by _player_to_reward_inputs() in main.py
    c.register_input("gold",             int,   "Player's current gold")
    c.register_input("food",             int,   "Player's current food supply")
    c.register_input("merchandise",      list,  "IDs of cards currently in merch deck")
    c.register_input("consumables",      list,  "IDs of consumables currently held")
    c.register_input("relic_ids",        list,  "IDs of equipped relics")
    c.register_input("relic_effects",    list,  "Effect keys of equipped relics")
    c.register_input("active_sets",      list,  "Card set IDs the player has at least one card from")
    c.register_input("merch_fullness",   float, "Merch deck fullness as 0-1 float")
    c.register_input("merch_slots_free", int,   "Empty merchandise deck slots")
    c.register_input("cons_slots_free",  int,   "Empty consumable deck slots")
    c.register_input("sell_count",       int,   "Total merchandise sold this run (coin_purse tracker)")
    c.register_input("towns_visited",    int,   "Towns visited this run (dorans_stonks tracker)")
    c.register_input("chosen_set",       str,   "Set chosen at loadout for specialists_mark, or empty string")
    c.register_input("decision_history", list,  "Ordered log of player decisions this run")

    # -------- Register outputs --------
    # The conductor returns a ranked version of the shop slot pool.
    c.register_output("shop_slot", list, "A ranked pool of shop slots; index 0 is highest intent alignment")

    # -------- Set intent --------
    c.set_intent(DEFAULT_REWARD_INTENT)

    return c
