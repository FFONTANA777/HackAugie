/*
ENCOUNTERS:
id: key identifier
type: "decision" | "minigame"
displayType: UI label
typeClass: CSS class for label color — TODO
icon: emoji icon — TODO
bg: background image path — TODO
title: encounter title — TODO
description: encounter flavour text — TODO
options: array of player choices
    label: button text
    outcomes: array of possible results (checked top to bottom, first match wins)
        condition: { type, id?, chance? }
        result:
            description: outcome flavour text — TODO
            effects: array of state mutations
*/

export const ENCOUNTERS = {

    // ===========
    // BANDITS
    // ===========
    bandits: {
        id: "bandits",
        type: "decision",
        displayType: "AMBUSH",
        typeClass: "TODO",
        icon: "TODO",
        bg: "TODO",
        title: "TODO",
        description: "TODO",
        options: [
            {
                label: "Make a run for it.",
                outcomes: [
                    {
                        condition: { type: "has_consumable_effect", id: "bandit_immunity" },
                        result: {
                            description: "TODO",
                            effects: [{ type: "default" }]
                        }
                    },
                    {
                        condition: { type: "has_consumable_effect", id: "fire_escape" },
                        result: {
                            description: "TODO",
                            effects: [{ type: "debuff", id: "food_cost", value: 2, duration: "next_leg" }]
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "TODO",
                            effects: [
                                { type: "lose_merch_random" },
                                { type: "lose_gold", value: 40 }
                            ]
                        }
                    }
                ]
            },
            {
                label: "Attempt to bargain your freedom.",
                outcomes: [
                    {
                        condition: { type: "has_merch_type", id: "jewelry" },
                        result: {
                            description: "TODO",
                            effects: [
                                { type: "lose_merch_random", id: "jewelry" },
                                { type: "gain_gold", value: 80 }
                            ]
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "TODO",
                            effects: [{ type: "lose_gold", value: 40 }]
                        }
                    }
                ]
            }
        ]
    },

    // ===========
    // STRANDED TRAVELER
    // ===========
    stranded_traveler: {
        id: "stranded_traveler",
        type: "decision",
        displayType: "ENCOUNTER",
        typeClass: "TODO",
        icon: "TODO",
        bg: "TODO",
        title: "TODO",
        description: "TODO",
        options: [
            {
                label: "Give them 2 food.",
                outcomes: [
                    {
                        condition: { type: "default" },
                        result: {
                            description: "TODO",
                            effects: [
                                { type: "lose_food", value: 2 },
                                { type: "offer_merchandise", count: 3, pick: 2 } // TODO: implement offer UI
                            ]
                        }
                    }
                ]
            },
            {
                label: "Give them 30 gold.",
                outcomes: [
                    {
                        condition: { type: "default" },
                        result: {
                            description: "TODO",
                            effects: [
                                { type: "lose_gold", value: 30 },
                                { type: "offer_relic", count: 3, pick: 1 } // TODO: implement offer UI
                            ]
                        }
                    }
                ]
            },
            {
                label: "Let them ride with you to the next town.",
                outcomes: [
                    {
                        condition: { type: "default" },
                        result: {
                            description: "TODO",
                            effects: [{ type: "buff", id: "shop_discount", value: 0.75, duration: "next_checkpoint" }]
                        }
                    }
                ]
            },
            {
                label: "Leave them behind.",
                outcomes: [
                    {
                        condition: { type: "default" },
                        result: {
                            description: "TODO",
                            effects: [{ type: "default" }]
                        }
                    }
                ]
            }
        ]
    },

    // ===========
    // RIVER
    // ===========
    river_crossing: {
        id: "river_crossing",
        type: "decision",
        displayType: "HAZARD",
        typeClass: "TODO",
        icon: "TODO",
        bg: "TODO",
        title: "TODO",
        description: "TODO",
        options: [
            {
                label: "Fish in the river.",
                outcomes: [
                    {
                        condition: { type: "random_split", branches: [0.25, 0.25, 0.50], index: 0 },
                        result: {
                            description: "TODO",
                            effects: [{ type: "offer_merchandise", count: 3, pick: 1 }]
                        }
                    },
                    {
                        condition: { type: "random_split", branches: [0.25, 0.25, 0.50], index: 1 },
                        result: {
                            description: "TODO",
                            effects: [{ type: "offer_relic", count: 3, pick: 1 }]
                        }
                    },
                    {
                        condition: { type: "random_split", branches: [0.25, 0.25, 0.50], index: 2 },
                        result: {
                            description: "TODO",
                            effects: [{ type: "lose_gold", value: 25 }]
                        }
                    }
                ]
            },
            {
                label: "Chop down a tree to bridge the river.",
                outcomes: [
                    {
                        condition: { type: "has_consumable_effect", id: "cross_trees" },
                        result: {
                            description: "TODO",
                            effects: [
                                { type: "use_consumable", id: "axe" },
                                { type: "offer_relic", count: 1, pick: 1 },       // TODO: implement offer UI
                                { type: "offer_merchandise", count: 1, pick: 1 }  // TODO: implement offer UI
                            ]
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "TODO",
                            effects: [{ type: "default" }]
                        }
                    }
                ]
            },
            {
                label: "Push through the river.",
                outcomes: [
                    {
                        condition: { type: "default" },
                        result: {
                            description: "TODO",
                            effects: [
                                { type: "lose_gold", value: 30 },
                                { type: "offer_merchandise_type", category: "art", count: 3, pick: 1 } // TODO: implement offer UI
                            ]
                        }
                    }
                ]
            }
        ]
    },

    // ===========
    // FELLOW TRADERS
    // ===========
    fellow_traders: {
        id: "fellow_traders",
        type: "decision",
        displayType: "HAZARD",
        typeClass: "danger",
        icon: "🌊",
        bg: "/Frontend/public/background/background_river.png",
        title: "The Swollen River",
        description: "The river runs fast and dark, swollen from recent rains. Your horse eyes the crossing nervously. There's no bridge in sight — just churning water and the road on the other side.",
        options: [
            {
                label: "Trade with them.",
                outcomes: [
                    {
                        condition: { type: "default" },
                        result: {
                            description: "TODO",
                            effects: [{ type: "open_trade_menu" }] // TODO: implement trade menu
                        }
                    }
                ]
            },
            {
                label: "Use a sleeping potion.",
                outcomes: [
                    {
                        condition: { type: "has_consumable_effect", id: "sleeping_potion" },
                        result: {
                            description: "TODO",
                            effects: [
                                { type: "use_consumable", id: "sleeping_potion" },
                                { type: "steal_merchandise", count: 2 } // TODO: implement steal from trade menu pool
                            ]
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "TODO",
                            effects: [{ type: "open_trade_menu" }] // TODO: implement trade menu
                        }
                    }
                ]
            }
        ]
    },

    // ===========
    // SHRINE / RUINS
    // ===========
    shrine: {
        id: "shrine",
        type: "decision",
        displayType: "SHRINE",
        typeClass: "TODO",
        icon: "TODO",
        bg: "TODO",
        title: "TODO",
        description: "TODO",
        options: [
            {
                label: "Search the buried treasures.",
                outcomes: [
                    {
                        condition: { type: "random", chance: 0.5 },
                        result: {
                            description: "TODO",
                            effects: [{ type: "gain_gold", value: 40 }]
                        }
                    },
                    {
                        condition: { type: "random", chance: 0.25 },
                        result: {
                            description: "TODO",
                            effects: [{ type: "gain_curse" }] // TODO: implement curse card
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "TODO",
                            effects: [{ type: "offer_relic", count: 1, pick: 1 }] // TODO: implement offer UI
                        }
                    }
                ]
            },
            {
                label: "Search the altar of relics.",
                outcomes: [
                    {
                        condition: { type: "has_merchandise" },
                        result: {
                            description: "TODO",
                            effects: [
                                { type: "lose_merch_random" },
                                { type: "gain_merch_upgrade_rarity" } // TODO: implement rarity upgrade
                            ]
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "TODO",
                            effects: [{ type: "default" }]
                        }
                    }
                ]
            },
            {
                label: "Search the remains of the fallen.",
                outcomes: [
                    {
                        condition: { type: "has_consumable_effect", id: "illuminate" },
                        result: {
                            description: "TODO",
                            effects: [
                                { type: "use_consumable", id: "torch" },
                                { type: "offer_merchandise", count: 1, pick: 1 } // TODO: implement offer UI
                            ]
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "TODO",
                            effects: [{ type: "gain_curse" }] // TODO: implement curse card
                        }
                    }
                ]
            }
        ]
    },

    // ===========
    // ROAD WRECKAGE
    // ===========
    road_wreckage: {
        id: "road_wreckage",
        type: "decision",
        displayType: "HAZARD",
        typeClass: "TODO",
        icon: "TODO",
        bg: "TODO",
        title: "TODO",
        description: "TODO",
        options: [
            {
                label: "Inspect the wreckage.",
                outcomes: [
                    {
                        condition: { type: "has_consumable_effect", id: "wagon_fix" },
                        result: {
                            description: "TODO",
                            effects: [
                                { type: "use_consumable", id: "wagon_fix" },
                                { type: "offer_merchandise", count: 1, pick: 1 } // TODO: implement offer UI
                            ]
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "TODO",
                            effects: [{ type: "lose_gold", value: 40 }]
                        }
                    }
                ]
            },
            {
                label: "Wait for a passerby.",
                outcomes: [
                    {
                        condition: { type: "default" },
                        result: {
                            description: "TODO",
                            effects: [
                                { type: "lose_food", value: 1 },
                                { type: "lose_gold", value: 5 },
                                { type: "open_shop_merchandise" } // TODO: implement roadside shop
                            ]
                        }
                    }
                ]
            }
        ]
    },

    // ===========
    // MYSTERIOUS CLOAKED PERSON
    // ===========
    mysterious_person: {
        id: "mysterious_person",
        type: "decision",
        displayType: "ENCOUNTER",
        typeClass: "TODO",
        icon: "TODO",
        bg: "TODO",
        title: "TODO",
        description: "TODO",
        options: [
            {
                label: "Ignore them and keep walking.",
                outcomes: [
                    {
                        condition: { type: "default" },
                        result: {
                            description: "TODO",
                            effects: [{ type: "default" }]
                        }
                    }
                ]
            },
            {
                label: "Offer to help them out of the forest.",
                outcomes: [
                    {
                        condition: { type: "random", chance: 0.5 },
                        result: {
                            description: "TODO",
                            effects: [{ type: "offer_legendary", pick: 1 }] // TODO: implement legendary offer (relic or merch)
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "TODO",
                            effects: [{ type: "gain_curse_forced" }] // TODO: implement forced gambit relic
                        }
                    }
                ]
            }
        ]
    },

    // ===========
    // TRAVELLING ARTIST
    // ===========
    travelling_artist: {
        id: "travelling_artist",
        type: "minigame",
        minigame: "item_value_comparison",
        minigameConfig: { category: "art" },
        displayType: "ENCOUNTER",
        typeClass: "TODO",
        icon: "TODO",
        bg: "TODO",
        title: "TODO",
        description: "TODO",
        // TODO: implement item_value_comparison minigame
        // Win (art category): gain merch of same set as highest rarity set item in inventory (or setless if N/A)
        // Win (non-art): gain random same rarity merch as submitted item
        // Lose: lose the selected merchandise submitted to compete
    },

    // ===========
    // TRAVELLING CHEF
    // ===========
    travelling_chef: {
        id: "travelling_chef",
        type: "minigame",
        minigame: "item_value_comparison",
        minigameConfig: { category: "spice" },
        displayType: "ENCOUNTER",
        typeClass: "TODO",
        icon: "TODO",
        bg: "TODO",
        title: "TODO",
        description: "TODO",
        // TODO: implement item_value_comparison minigame
        // Win (spice category): gain merch of same set as highest rarity set item in inventory (or setless if N/A)
        // Win (non-spice): gain random same rarity merch as submitted item
        // Lose: lose the selected merchandise submitted to compete
    },

    // ===========
    // TRAVELLING SCHOLAR
    // ===========
    travelling_scholar: {
        id: "travelling_scholar",
        type: "minigame",
        minigame: "item_value_comparison",
        minigameConfig: { category: "literature" },
        displayType: "ENCOUNTER",
        typeClass: "TODO",
        icon: "TODO",
        bg: "TODO",
        title: "TODO",
        description: "TODO",
        // TODO: implement item_value_comparison minigame
        // Win (literature category): gain merch of same set as highest rarity set item in inventory (or setless if N/A)
        // Win (non-literature): gain random same rarity merch as submitted item
        // Lose: lose the selected merchandise submitted to compete
    },

    // ===========
    // TRAVELLING JEWELER
    // ===========
    travelling_jeweler: {
        id: "travelling_jeweler",
        type: "minigame",
        minigame: "item_value_comparison",
        minigameConfig: { category: "jewelry" },
        displayType: "ENCOUNTER",
        typeClass: "TODO",
        icon: "TODO",
        bg: "TODO",
        title: "TODO",
        description: "TODO",
        // TODO: implement item_value_comparison minigame
        // Win (jewelry category): gain merch of same set as highest rarity set item in inventory (or setless if N/A)
        // Win (non-jewelry): gain random same rarity merch as submitted item
        // Lose: lose the selected merchandise submitted to compete
    },

    // ===========
    // ABANDONED MINES
    // ===========
    abandoned_mines: {
        id: "abandoned_mines",
        type: "decision",
        displayType: "EXPLORE",
        typeClass: "TODO",
        icon: "TODO",
        bg: "TODO",
        title: "TODO",
        description: "TODO",
        options: [
            {
                label: "Explore inside the mines.",
                outcomes: [
                    {
                        condition: { type: "has_consumable_effect", id: "illuminate" },
                        result: {
                            description: "TODO",
                            effects: [{ type: "offer_merchandise", count: 3, pick: 2 }] // TODO: implement offer UI
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "TODO",
                            effects: [{ type: "offer_merchandise", count: 3, pick: 1 }] // TODO: implement offer UI
                        }
                    }
                ]
            },
            {
                label: "Explore the shack nearby.",
                outcomes: [
                    {
                        condition: { type: "default" },
                        result: {
                            description: "TODO",
                            effects: [{ type: "open_miner_trade" }] // TODO: implement old miner trade (merch for food only, no gold)
                        }
                    }
                ]
            }
        ]
    }
}