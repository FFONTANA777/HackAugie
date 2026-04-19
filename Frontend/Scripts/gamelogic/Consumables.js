/*
SINGLE USE ONLY
CONSUMABLES: standard pool. Drawn from for shops, event rewards, trader inventory.
STARTER_ITEMS: loadout-only. Same shape as consumables, occupies a consumable slot,
but never appears outside the starting loadout screen.

id: identifier
type: "consumable" (for deck allocation; starter items are also "consumable")
name: text display
baseValue: gold value for buy/sell
description: text body
effect: key for functionality
*/

export const CONSUMABLES = {
    // Event Focused Consumables
    sword: {
        id: "sword",
        type: "consumable",
        name: "Sword",
        baseValue: 30,
        description: "Survive a bandit encounter without losing supplies.",
        effect: "bandit_immunity"
    },
    repel: {
        id: "repel",
        type: "consumable",
        name: "Repel",
        baseValue: 30,
        description: "Reduces encounter count on the next leg by 1.",
        effect: "reduce_encounters"
    },
    recon: {
        id: "recon",
        type: "consumable",
        name: "Recon",
        baseValue: 30,
        description: "Reveal the next 2 encounters on this leg.",
        effect: "reveal_encounters"
    },
    tip_sheet: {
        id: "tip_sheet",
        type: "consumable",
        name: "Tip Sheet",
        baseValue: 30,
        description: "Preview the next town's shop inventory.",
        effect: "reveal_shop"
    },
    totem_of_undying: {
        id: "totem_of_undying",
        type: "consumable",
        name: "Totem of Undying",
        baseValue: 30,
        description: "Destroys a cursed relic",
        effect: "lift_curse"
    },
    forged_papers: {
        id: "forged_papers",
        type: "consumable",
        name: "Forged Papers",
        baseValue: 25,
        description: "Enter the next town without paying the entry fee.",
        effect: "skip_town_fee"
    },

    // Multiple Functions Consumables
    axe: {
        id: "axe",
        type: "consumable",
        name: "Axe",
        baseValue: 30,
        description: "Survive a bandit encounter, or clear a tree-based hazard.",
        effect:  ["bandit_immunity", "cross_trees"]
    },
    pickaxe: {
        id: "pickaxe",
        type: "consumable",
        name: "Pickaxe",
        baseValue: 30,
        description: "Survive a bandit encounter, or clear a stone-based hazard.",
        effect:  ["bandit_immunity", "cross_stones"]
    },
    healing_kit: {
        id: "healing_kit",
        type: "consumable",
        name: "Healing Kit",
        baseValue: 50,
        description: "Restore 5 food, or survive a bandit encounter with reduced penalty.",
        effect: ["restore_food", "bandit_reduced"]
    },
    rope: {
        id: "rope",
        type: "consumable",
        name: "Rope",
        baseValue: 40,
        description: "Escape a bandit encounter, or cross a stone hazard.",
        effect: ["bandit_escape", "cross_stones"]
    },
    fishing_net: {
        id: "fishing_net",
        type: "consumable",
        name: "Fishing Net",
        baseValue: 40,
        description: "Restore 3 food, or safely cross a river hazard.",
        effect: ["restore_food", "cross_river"]
    },
    oil_flask: {
        id: "oil_flask",
        type: "consumable",
        name: "Oil Flask",
        baseValue: 40,
        description: "Scare off bandits for the rest of this leg, or burn through a tree hazard.",
        effect: ["bandit_leg_immunity", "clear_tree"]
    },
    torch: {
        id: "torch",
        type: "consumable",
        name: "Torch",
        baseValue: 20,
        description: "Frighten off pursuers with fire, or light your way through a dark hazard.",
        effect: ["fire_escape", "illuminate"]
    }
}

export const STARTER_ITEMS = {
    travel_rations: {
        id: "travel_rations",
        type: "consumable",
        source: "starter",
        name: "Travel Rations",
        description: "Skip the food cost on your next leg. Encounters increase.",
        effect: "risky_rations"
    },
    dorans_stonks: {
        id: "dorans_stonks",
        type: "consumable",
        source: "starter",
        name: "Doran's Stonks",
        description: "First town: sell for 80% value. Later towns: sell for 150%.",
        effect: "delayed_sell"
    },
    piggy_bank: {
        id: "piggy_bank",
        type: "consumable",
        source: "starter",
        name: "Piggy Bank",
        description: "Reach a money threshold to trigger a reward.",
        effect: "money_milestone"
    },
    back_to_basics: {
        id: "back_to_basics",
        type: "consumable",
        source: "starter",
        name: "Back to Basics",
        description: "Wagon cannot be upgraded. All sell prices permanently increased by 15%.",
        effect: "no_upgrades_bonus"
    },
    crocea_mors: {
        id: "crocea_mors",
        type: "consumable",
        source: "starter",
        name: "Crocea Mors",
        description: "Pick 2 starter items. You must accept every offer for the leg.",
        effect: "veni_vidi_vici"
    },
    specialists_mark: {
        id: "specialists_mark",
        type: "consumable",
        source: "starter",
        name: "Specialist's Mark",
        description: "Pick one merchandise set. Cards in that set sell for double. All other merchandise sells for 50%.",
        effect: "set_specialist"
}
}