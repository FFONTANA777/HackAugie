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
        title: "Bandits in the Brush",
        description: "You are ambushed by bandits! Are you capable of fending for yourself or will you lose your livlihood to the likes of them?",
        options: [
            {
                label: "Make a run for it.",
                outcomes: [
                    {
                        condition: { type: "has_consumable_effect", id: "bandit_immunity" },
                        result: {
                            description: "With a great weapon, you intimidate the bandits. Their hesitation buys you enough time to escape, bravo.",
                            effects: [{ type: "default" }]
                        }
                    },
                    {
                        condition: { type: "has_consumable_effect", id: "fire_escape" },
                        result: {
                            description: "Your horse is scared of fire and your torch burns bright and near its rear. The speed picks up and you escape, but at what cost?",
                            effects: [{ type: "debuff", id: "food_cost", value: 2, duration: "next_leg" }]
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "Unfortunately, the bandits are lighter than your cargo, enabling a fast encirclement around you.",
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
                            description: "With great persuasion and the bandit leader's anniversity coming up, you manage to make a sale instead of getting robbed, bravo.",
                            effects: [
                                { type: "lose_merch_random", id: "jewelry" },
                                { type: "gain_gold", value: 80 }
                            ]
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "Your charisma needs work, and your inventory a new make over for it is lacking. Your liquidity takes a hit.",
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
        title: "The Scarcity of Charity",
        description: "You stumble upon a weak and feeble traveler. He seems headed in the same direction and you. Your rations are plentiful, but will your generousity be as well?",
        options: [
            {
                label: "Give them 2 food.",
                outcomes: [
                    {
                        condition: { type: "default" },
                        result: {
                            description: "Your charity brings upon you great karma, rejoice.",
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
                            description: "Feeble, but now rich is the old man. He is greatful to an extent.",
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
                            description: "A chaffeur for the feeble, how noble. You find out he's quite big in the commerce world, lucky.",
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
                            description: "Business is life, and you life is business.",
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
                            description: "Your skills shine through, richs and fortune.",
                            effects: [{ type: "offer_merchandise", count: 3, pick: 1 }]
                        }
                    },
                    {
                        condition: { type: "random_split", branches: [0.25, 0.25, 0.50], index: 1 },
                        result: {
                            description: "Your skills shine through, fortunes and riches.",
                            effects: [{ type: "offer_relic", count: 3, pick: 1 }]
                        }
                    },
                    {
                        condition: { type: "random_split", branches: [0.25, 0.25, 0.50], index: 2 },
                        result: {
                            description: "An unfortunate and clumsy fall, landing you in the red for today.",
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
                            description: "Felling a tree to cross a river. You must have business to attent to.",
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
                            description: "Attempting to fall the tree with no tools, quite a dream.",
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
                            description: "Soggy boots never hurt no one.",
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
        displayType: "ENCOUNTER",
        typeClass: "TODO",
        icon: "TODO",
        bg: "TODO",
        title: "Opportune Business",
        description: "Both of you are like minded in business. This chance has the prospects of profit and trade. May conversation land you in the green.",
        options: [
            {
                label: "Trade with them.",
                outcomes: [
                    {
                        condition: { type: "default" },
                        result: {
                            description: "Equal footing, equal oppurtunity, equal trade, equal business.",
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
                            description: "All cards must be played at the table if there is business involved.",
                            effects: [
                                { type: "use_consumable", id: "sleeping_potion" },
                                { type: "steal_merchandise", count: 2 } // TODO: implement steal from trade menu pool
                            ]
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "You look for an upper hand, but find not such advantage.",
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
        title: "The Whispering Ossuary",
        description: "You stumble upon the skeletal remains of a sanctum, half-swallowed by the earth. A heavy, hallowed silence hangs here, broken only by the faint metallic scent of ancient wealth and the chill of lingering spirits.",
        options: [
            {
                label: "Search the buried treasures.",
                outcomes: [
                    {
                        condition: { type: "random", chance: 0.5 },
                        result: {
                            description: "Your fingers brush against cold metal beneath the silt—a cache of coins from a forgotten dynasty.",
                            effects: [{ type: "gain_gold", value: 40 }]
                        }
                    },
                    {
                        condition: { type: "random", chance: 0.25 },
                        result: {
                            description: "As you reach for a glint of gold, a cold shiver climbs your spine. You have disturbed a slumber that was meant to be eternal.",
                            effects: [{ type: "gain_curse" }] // TODO: implement curse card
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "Amidst the rubble, you unearth an object that hums with a faint, otherworldly resonance.",
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
                            description: "You lay a mundane offering upon the cracked marble. The altar flares with a pale luminescence, transmuting your tribute into something... greater.",
                            effects: [
                                { type: "lose_merch_random" },
                                { type: "gain_merch_upgrade_rarity" } // TODO: implement rarity upgrade
                            ]
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "The altar remains cold and indifferent. It demands a physical sacrifice you do not currently possess.",
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
                            description: "You offer the dead a final, cleansing flame. As the pyre consumes the remains, a single, pristine curiosity is left behind in the ashes.",
                            effects: [
                                { type: "use_consumable", id: "torch" },
                                { type: "offer_merchandise", count: 1, pick: 1 } // TODO: implement offer UI
                            ]
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "Desecrating the dead for mere scrap is a stain upon the soul. The shadows of the fallen cling to you as you rifle through their pockets.",
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
        title: "BANG?!!",
        description: "Your journey comes to a temporary halt as your ride is dismantled",
        options: [
            {
                label: "Inspect the wreckage.",
                outcomes: [
                    {
                        condition: { type: "has_consumable_effect", id: "wagon_fix" },
                        result: {
                            description: "The repairs are complete, but the road has left you a parting gift. That bone-jarring bump was no stone, but a displaced bundle of random sundries ripe for the taking.",
                            effects: [
                                { type: "use_consumable", id: "wagon_fix" },
                                { type: "offer_merchandise", count: 1, pick: 1 } // TODO: implement offer UI
                            ]
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "A charisatic rogue materializes from the brush, peddling spurious repairs for a steep price. You surrender your gold to his gilded lies, only to find the craftsmanship as hollow as his smile.",
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
                            description: "Idle hands and a waiting heart deplete your stores and drain your gold. Eventually, the silence is broken by a passing peddler, who lays bare his inventory to satisfy your needs.",
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
        title: "???",
        description: "You pause as the figure uncoils from the dark, a silent question rising in your mind: is this a soul in need of grace, or a snare set for the righteous?",
        options: [
            {
                label: "Ignore them and keep walking.",
                outcomes: [
                    {
                        condition: { type: "default" },
                        result: {
                            description: "You left the mysterious figure behind",
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
                            description: "You have looked upon the Sun of Justice, and your soul feels both heavy with truth and light as a prayer.",
                            effects: [{ type: "offer_legendary", pick: 1 }] // TODO: implement legendary offer (relic or merch)
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "You have bartered glances with the Architect of Ruin, and the shadows you once feared now feel like your own.",
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
        type: "decision",
        minigame: "item_value_comparison",
        minigameConfig: { category: "art" },
        displayType: "ENCOUNTER",
        typeClass: "TODO",
        icon: "TODO",
        bg: "TODO",
        title: "Van Gogh",
        description: "An artisan seeks a contemporary of refined vision. Will you challenge his valuation of the realm’s most evocative masterpieces?",
        options: [
            {
                label: "Trade merchandise with them.",
                outcomes: [
                    {
                        condition: { type: "default" },
                        result: {
                            description: "Trade merchandise with them.",
                            effects: [{ type: "open_trade_menu" }] // TODO
                        }
                    }
                ]
            },
            {
                label: "Compete in a value comparison.",
                outcomes: [
                    {
                        condition: { type: "default" },
                        result: {
                            description: "Best of luck, put your best foot forward.",
                            effects: [{ type: "start_minigame", minigame: "item_value_comparison", category: "literature" }]
                        }
                    }
                ]
            }
        ]
    },

    // ===========
    // TRAVELLING CHEF
    // ===========
    travelling_chef: {
        id: "travelling_chef",
        type: "decision",
        minigame: "item_value_comparison",
        minigameConfig: { category: "spice" },
        displayType: "ENCOUNTER",
        typeClass: "TODO",
        icon: "TODO",
        bg: "TODO",
        title: "Gordon Ramsey",
        description: "A chef seeks a peer of the palate. Will you challenge his valuation of the world’s finest aromatics?",
        options: [
            {
                label: "Trade merchandise with them.",
                outcomes: [
                    {
                        condition: { type: "default" },
                        result: {
                            description: "Trade merchandise with them.",
                            effects: [{ type: "open_trade_menu" }] // TODO
                        }
                    }
                ]
            },
            {
                label: "Compete in a value comparison.",
                outcomes: [
                    {
                        condition: { type: "default" },
                        result: {
                            description: "Best of luck, put your best foot forward.",
                            effects: [{ type: "start_minigame", minigame: "item_value_comparison", category: "literature" }]
                        }
                    }
                ]
            }
        ]
    },

    // ===========
    // TRAVELLING SCHOLAR
    // ===========
    travelling_scholar: {
        id: "travelling_scholar",
        type: "decision",
        minigame: "item_value_comparison",
        minigameConfig: { category: "literature" },
        displayType: "ENCOUNTER",
        typeClass: "TODO",
        icon: "TODO",
        bg: "TODO",
        title: "Sun Tzu",
        description: "A scholar approaches, seeking a rival in discernment. Dare you challenge his valuation of the world's curiosities?",
        options: [
            {
                label: "Trade merchandise with them.",
                outcomes: [
                    {
                        condition: { type: "default" },
                        result: {
                            description: "Trade merchandise with them.",
                            effects: [{ type: "open_trade_menu" }] // TODO
                        }
                    }
                ]
            },
            {
                label: "Compete in a value comparison.",
                outcomes: [
                    {
                        condition: { type: "default" },
                        result: {
                            description: "Best of luck, put your best foot forward.",
                            effects: [{ type: "start_minigame", minigame: "item_value_comparison", category: "literature" }]
                        }
                    }
                ]
            }
        ]
    },

    // ===========
    // TRAVELLING JEWELER
    // ===========
    travelling_jeweler: {
        id: "travelling_jeweler",
        type: "decision",
        minigame: "item_value_comparison",
        minigameConfig: { category: "jewelry" },
        displayType: "ENCOUNTER",
        typeClass: "TODO",
        icon: "TODO",
        bg: "TODO",
        title: "Tiffany",
        description: "A jeweler arrives, seeking a rival of merit. Dare you test your intuition in a game of gilded stakes?",
        options: [
            {
                label: "Trade merchandise with them.",
                outcomes: [
                    {
                        condition: { type: "default" },
                        result: {
                            description: "Trade merchandise with them.",
                            effects: [{ type: "open_trade_menu" }] // TODO
                        }
                    }
                ]
            },
            {
                label: "Compete in a value comparison.",
                outcomes: [
                    {
                        condition: { type: "default" },
                        result: {
                            description: "Best of luck, put your best foot forward.",
                            effects: [{ type: "start_minigame", minigame: "item_value_comparison", category: "literature" }]
                        }
                    }
                ]
            }
        ]
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
        title: "Abandon Mines",
        description: "Explore the unknown left behind",
        options: [
            {
                label: "Explore inside the mines.",
                outcomes: [
                    {
                        condition: { type: "has_consumable_effect", id: "illuminate" },
                        result: {
                            description: "As the light pierces through the darkness, the cast-off bounty of the dark is laid bare.",
                            effects: [{ type: "offer_merchandise", count: 3, pick: 2 }] // TODO: implement offer UI
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "As the rusted hinges protest in a discordant shriek, you find an ancient excavator peddling the earth’s secrets in exchange for a few stray morsels.",
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