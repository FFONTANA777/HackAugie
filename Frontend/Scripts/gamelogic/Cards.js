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
    rare: 45,
    epic: 60,
    legendary: 100,
    mythic: 300
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
        rarity: "rare",
        description: "Fine eastern silk. Part of the Eastern Goods set."
    },
    spice: {
        id: "spice",
        type: "merchandise",
        name: "Spice",
        set: "eastern_goods",
        rarity: "uncommon",
        description: "Exotic spices. Part of the Eastern Goods set."
    },

    // --- Farmland Goods set (2 cards, staple tier) ---
    grain: {
        id: "grain",
        type: "merchandise",
        name: "Grain",
        set: "farmland_goods",
        rarity: "common",
        description: "Staple grain. Part of the Farmland Goods set."
    },
    wool: {
        id: "wool",
        type: "merchandise",
        name: "Wool",
        set: "farmland_goods",
        rarity: "common",
        description: "Raw wool. Part of the Farmland Goods set."
    },

    // --- Highland Goods set (3 cards, mid tier with a chase) ---
    iron_ore: {
        id: "iron_ore",
        type: "merchandise",
        name: "Iron Ore",
        set: "highland_goods",
        rarity: "common",
        description: "Unrefined iron pulled from mountain mines. Part of the Highland Goods set."
    },
    furs: {
        id: "furs",
        type: "merchandise",
        name: "Furs",
        set: "highland_goods",
        rarity: "uncommon",
        description: "Thick pelts from mountain trappers. Part of the Highland Goods set."
    },
    silver_ingot: {
        id: "silver_ingot",
        type: "merchandise",
        name: "Silver Ingot",
        set: "highland_goods",
        rarity: "epic",
        description: "Refined silver. Hard to come by. Part of the Highland Goods set."
    },

    // --- Coastal Goods set (3 cards, trade-route flavor) ---
    salt: {
        id: "salt",
        type: "merchandise",
        name: "Salt",
        set: "coastal_goods",
        rarity: "common",
        description: "Preserved sea salt. Part of the Coastal Goods set."
    },
    pearls: {
        id: "pearls",
        type: "merchandise",
        name: "Pearls",
        set: "coastal_goods",
        rarity: "rare",
        description: "Lustrous pearls harvested from coastal waters. Part of the Coastal Goods set."
    },
    dried_fish: {
        id: "dried_fish",
        type: "merchandise",
        name: "Dried Fish",
        set: "coastal_goods",
        rarity: "common",
        description: "Salt-cured fish. Part of the Coastal Goods set."
    },

    // --- Arcane Goods set (3 cards, legendary-tier, hardest to complete) ---
    moonwater: {
        id: "moonwater",
        type: "merchandise",
        name: "Moon Water",
        set: "arcane_goods",
        rarity: "uncommon",
        description: "Water collected under the full moon. Part of the Arcane Goods set."
    },
    starshard: {
        id: "starshard",
        type: "merchandise",
        name: "Star Shard",
        set: "arcane_goods",
        rarity: "epic",
        description: "A fragment of fallen sky. Part of the Arcane Goods set."
    },
    dragonsbreath: {
        id: "dragonsbreath",
        type: "merchandise",
        name: "Dragon's Breath",
        set: "arcane_goods",
        rarity: "legendary",
        description: "Bottled fire. Whisper of wyrms. Part of the Arcane Goods set."
    },

    // --- Individual merchandise (no set) ---
    travel_map: {
        id: "travel_map",
        type: "merchandise",
        name: "Travel Map",
        set: null,
        rarity: "uncommon",
        description: "A hand-drawn map of distant routes. Valuable to the right buyer."
    },
    jeweled_dagger: {
        id: "jeweled_dagger",
        type: "merchandise",
        name: "Jeweled Dagger",
        set: null,
        rarity: "rare",
        description: "Ceremonial blade. Decorative, not practical."
    },
    masterwork_saddle: {
        id: "masterwork_saddle",
        type: "merchandise",
        name: "Masterwork Saddle",
        set: null,
        rarity: "epic",
        description: "Finest leatherwork. Coveted by nobility."
    },
    lost_crown: {
        id: "lost_crown",
        type: "merchandise",
        name: "Lost Crown",
        set: null,
        rarity: "mythic",

        description: "A forgotten royal relic. Worth its true value only at journey's end."
    },
}

export const SETS = {
    eastern_goods: {
        name: "Eastern Goods",
        cards: ["silk", "spice"],
        sellBonus: 1.4
    },
    farmland_goods: {
        name: "Farmland Goods",
        cards: ["grain", "wool"],
        sellBonus: 1.6
    },
    highland_goods: {
        name: "Highland Goods",
        cards: ["iron_ore", "furs", "silver_ingot"],
        sellBonus: 1.5
    },
    coastal_goods: {
        name: "Coastal Goods",
        cards: ["salt", "pearls", "dried_fish"],
        sellBonus: 1.5
    },
    arcane_goods: {
        name: "Arcane Goods",
        cards: ["moonwater", "starshard", "dragonsbreath"],
        sellBonus: 1.3
    }
}