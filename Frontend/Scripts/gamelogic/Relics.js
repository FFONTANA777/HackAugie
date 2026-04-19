/*
RELICS:
id: RELICS key identifier
name: text name display
description: text body for display
effect: key value for functionality
*/

export const RELICS = {
    merchant_scales: {
        id: "merchant_scales",
        name: "Merchant's Scales",
        description: "Sell all merchandise for 10% more gold.",
        effect: "sell_bonus_all"
    },
    empty_pockets: {
        id: "empty_pockets",
        name: "Empty Pockets",
        description: "While you have less than 20 gold, shop prices are reduced by 30%.",
        effect: "broke_discount"
    },

    // Curse Relics
    cracked_mirror: {
        id: "cracked_mirror",
        name: "Cracked Mirror",
        description: "All shop prices increased by 25%.",
        effect: "curse_inflation",
        cursed: true
    },
    leaking_purse: {
        id: "leaking_purse",
        name: "Leaking Purse",
        description: "Lose 2 gold at the start of every leg.",
        effect: "curse_gold_drain",
        cursed: true
    },
}