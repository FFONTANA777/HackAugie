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
        description: "Sell all merchandise for 20 more gold.",
        effect: "sell_bonus_all"
    },
    empty_pockets: {
        id: "empty_pockets",
        name: "Empty Pockets",
        description: "While you have less than 20 gold, shop prices are reduced by 10.",
        effect: "broke_discount"
    },
    coin_purse: {
        id: "coin_purse",
        name: "Coin Purse",
        description: "Every 3rd merchandise card you sell grants +5 bonus gold.",
        effect: "sell_streak_bonus"
    },
    friends: {
        id: "friends",
        name: "Friends",
        description: "Town shop items will be discounted by 5 gold",
        effect: "shop_discount"
    },
    gamblers_luck: {
        id: "gamblers_luck",
        name: "Gambler's Luck",
        description: "All gold rewards are doubled or zeroed, 50/50.",
        effect: "double_or_nothing"
    },
    negotiators_pin: {
        id: "negotiators_pin",
        name: "Negotiator's Pin",
        description: "Trader encounters always offer one additional card.",
        effect: "trader_extra_offer"
    },

    // Curse Relics
    bad_omen: {
        id: "bad_omen",
        name: "Bad Omen",
        description: "All shop prices increased by 25.",
        effect: "curse_inflation",
        cursed: true
    },
    leaking_pouch: {
        id: "leaking_pouch",
        name: "Leaking Pouch",
        description: "Lose 2 gold at the start of every leg.",
        effect: "curse_gold_drain",
        cursed: true
    },
    hunger: {
        id: "hunger",
        name: "Hunger",
        description: "Travel cost is increased by 1 food per leg.",
        effect: "curse_hunger",
        cursed: true
    },
}