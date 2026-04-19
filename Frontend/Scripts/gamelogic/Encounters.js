/* 
ENCOUNTERS:
*/ 

export const ENCOUNTERS = {
    bandits: {
        id: "bandits",
        type: "decision",
        title: "Survival of the Fittest",
        description: "The sound of snapping twigs precedes a cold realization: you aren't alone on the pass. Rough-looking men emerge from the treeline, their eyes lingering greedily on your heavy crates. They don't want your life—just your livelihood.",
        options: [
            {
                label: "Hope for the best and make a run for it.",
                outcomes: [
                    {
                        condition: { type: "has_consumable_type", id: "weapon" },
                        result: {
                            description: "Seeing the gleem of your mighty weapon, they hesitate and call off their pursuit.",
                            effects: [{ type: "default" }]
                        }
                    },
                    {
                        condition: { type: "has_consumable_id", id: "torch" },
                        result: {
                            description: "Using the threat of your flames, your horse runs faster. You escape but the horse needs extra feed as compensation.",
                            effects: [{ type: "debuff", id: "food", value: 2, duration: "next_leg" }]
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "With no repelants, the bandits chase after you. Lose a random Merchandise Card and some gold.",
                            effects: [
                                { type: "lose_merch_random" },
                                { type: "lose_gold", value: 40 }
                            ]
                        }
                    }
                ]
            },
            {
                label: "Attempt to converse and bargain your freedom.",
                outcomes: [
                    {
                        condition: { type: "has_merch_type", id: "jewelry" },
                        result: {
                            description: "The bandit lead finds the perfect anniversity gift and is so happy he buys the item off you.",
                            effects: [
                                { type: "lose_merch_random", id: "jewelry" },
                                { type: "gain_gold", value: 80 }
                            ]
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "The uncivilized are uncivil, how surprising. You lose 60 gold.",
                            effects: [
                                { type: "lose_gold", value: 60 }
                            ]
                        }
                    }
                ]
            }
        ]
    },

    river_crossing: {
        id: "river_crossing",
        type: "decision",
        title: "The Swollen River",
        description: "The river runs fast and dark, swollen from recent rains. Your horse eyes the crossing nervously. There's no bridge in sight — just churning water and the road on the other side.",
        options: [
            {
                label: "Attempt the crossing.",
                outcomes: [
                    {
                        condition: { type: "has_consumable_id", id: "axe" },
                        result: {
                            description: "You spot a large tree nearby. A few clean swings and it crashes across the river — a perfect bridge. You cross without incident.",
                            effects: [{ type: "default" }]
                        }
                    },
                    {
                        condition: { type: "random", chance: 0.4 },
                        result: {
                            description: "You make it across. The cart takes a beating but everything holds.",
                            effects: [{ type: "default" }]
                        }
                    },
                    {
                        condition: { type: "default" },
                        result: {
                            description: "The current is stronger than it looked. A crate breaks loose and your coin purse takes a hit.",
                            effects: [
                                { type: "lose_merch_random" },
                                { type: "lose_gold", value: 30 }
                            ]
                        }
                    }
                ]
            }
        ]
    }
}