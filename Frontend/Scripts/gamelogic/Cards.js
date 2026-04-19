/* 
RARITY_VALUES:
rarity: value of this rarity

CARDS (merchandise):
id: CARDS key value identifier
type: for deck allocation
name: text name display
set: SETS key value identifier
rarity: base gold value to sell/buy/trade this rarity
description: text body for display

SETS:
name: text name display
cards: list of CARDS key value identifiers
sellBonus: sell value multiplier
*/ 

export const RARITY_VALUES = {
    common: 15,
    uncommon: 30,
    rare: 60
}

export const CARDS = {
    // ===========
    // MERCHANDISE
    // ===========
    silk: {
        id: "silk",
        type: "merchandise",
        name: "Silk",
        set: "eastern_goods",
        rarity: "",
        description: "Fine eastern silk. Part of the Eastern Goods set."
    },
    spice: {
        id: "spice",
        type: "merchandise",
        name: "Spice",
        set: "eastern_goods",
        rarity: "",
        description: "Exotic spices. Part of the Eastern Goods set."
    },
    grain: {
        id: "grain",
        type: "merchandise",
        name: "Grain",
        set: "farmland_goods",
        rarity: "",
        description: "Staple grain. Part of the Farmland Goods set."
    },
    wool: {
        id: "wool",
        type: "merchandise",
        name: "Wool",
        set: "farmland_goods",
        rarity: "",
        description: "Raw wool. Part of the Farmland Goods set."
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