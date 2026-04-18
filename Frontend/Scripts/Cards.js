/* 
================
Data Definitions
================
CARDS (merchandise):
id: CARDS key value identifier
type: for deck allocation
name: text name display
set: SETS key value identifier
baseValue: base gold value to sell/buy/trade
description: text body for display

CARDS (consumables):
id: CARDS key value identifier
type: for deck allocation
name: text name display
baseValue: base gold value to sell/buy/trade
description: text body for display
effect: item purpose -> key value for functionality

SETS:
name: text name display
cards: list of CARDS key value identifiers
sellBonus: sell value multiplier
*/ 

export const CARDS = {
    // ===========
    // MERCHANDISE
    // ===========
    silk: {
        id: "silk",
        type: "merchandise",
        name: "Silk",
        set: "eastern_goods",
        baseValue: 30,
        description: "Fine eastern silk. Part of the Eastern Goods set."
    },
    spice: {
        id: "spice",
        type: "merchandise",
        name: "Spice",
        set: "eastern_goods",
        baseValue: 25,
        description: "Exotic spices. Part of the Eastern Goods set."
    },
    grain: {
        id: "grain",
        type: "merchandise",
        name: "Grain",
        set: "farmland_goods",
        baseValue: 15,
        description: "Staple grain. Part of the Farmland Goods set."
    },
    
    // ===========
    // CONSUMABLES
    // ===========
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

export const SETS = {
    eastern_goods: {
        name: "Eastern Goods",
        cards: ["silk", "spice"],
        sellBonus: 1.5
    },
    farmland_goods: {
        name: "Farmland Goods",
        cards: ["grain", "wool"],
        sellBonus: 1.3
    }
}