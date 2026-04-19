/*
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
    weapon: {
        id: "weapon",
        type: "consumable",
        name: "Weapon",
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
}

export const STARTER_ITEMS = {
    travel_rations: {
        id: "travel_rations",
        type: "consumable",
        source: "starter",
        name: "Travel Rations",
        description: "Skip the food cost of your next leg, but attracts more danger",
        effect: "risky_rations"
    },
    dorans_stonks: {
        id: "doransstonks",
        type: "consumable",
        source: "starter",
        name: "Doran's Stonks",
        description: "Selling on first town gives you 80% of the item value, but on the next town it will earn you 50% more",
        effect: "delayed_sell"
    },
    piggy_bank: {
        id: "piggybank",
        type: "consumable",
        source: "starter",
        name: "Piggy Bank",
        description: "Reaching a certain amount of gold will grant you something",
        effect: "gold_milestone"
    },
}