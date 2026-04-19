import { CARDS, RARITY_VALUES } from './Cards.js'
import { SETS } from './Cards.js'
import gameObject from './GameLogic.js'

const RARITY_ORDER = ["common", "uncommon", "rare", "epic", "legendary", "mythic"]

function getRarityRank(rarity) {
    return RARITY_ORDER.indexOf(rarity)
}

function getHighestRaritySetItem(merchandise) {
    // find highest rarity item that belongs to a set
    const setItems = merchandise.filter(c => c.set)
    if (setItems.length === 0) return null
    return setItems.reduce((best, card) =>
        getRarityRank(card.rarity) > getRarityRank(best.rarity) ? card : best
    )
}

function getRandomByRarity(rarity, excludeId = null) {
    const pool = Object.values(CARDS).filter(c =>
        c.type === "merchandise" &&
        c.rarity === rarity &&
        c.id !== excludeId
    )
    if (pool.length === 0) return null
    return pool[Math.floor(Math.random() * pool.length)]
}

function getMatchingSetCard(merchandise) {
    const anchor = getHighestRaritySetItem(merchandise)
    if (!anchor) {
        // no set items — return random setless card
        const setless = Object.values(CARDS).filter(c =>
            c.type === "merchandise" && !c.set
        )
        return setless[Math.floor(Math.random() * setless.length)]
    }
    // find a card from the same set the player doesn't already have
    const set = SETS[anchor.set]
    const playerIds = merchandise.map(c => c.id)
    const missing = set.cards.filter(id => !playerIds.includes(id))
    if (missing.length === 0) {
        // player has full set — give same rarity from any set
        return getRandomByRarity(anchor.rarity, anchor.id)
    }
    return CARDS[missing[Math.floor(Math.random() * missing.length)]]
}

export function initItemValueComparison(encounter, gameObject) {
    // signal UI to start the minigame
    gameObject.gameState.pendingMinigame = {
        type: "item_value_comparison",
        category: encounter.minigameConfig.category,
        encounterId: encounter.id,
        phase: "pick"  // "pick" | "reveal" | "result"
    }
    gameObject._notify()
}

export function resolveItemValueComparison(wageredCardId) {
    const minigame = gameObject.gameState.pendingMinigame
    const category = minigame.category

    const wagered = gameObject.player.merchandise.find(c => c.id === wageredCardId)
    if (!wagered) return

    // trader draws from their category
    const traderPool = Object.values(CARDS).filter(c =>
        c.type === "merchandise" &&
        c.category === category
    )
    const traderCard = traderPool[Math.floor(Math.random() * traderPool.length)]

    const playerRank = getRarityRank(wagered.rarity)
    const traderRank = getRarityRank(traderCard.rarity)

    let outcome = null

    if (playerRank > traderRank) {
        // player wins
        if (wagered.category === category) {
            // matching category win
            const reward = getMatchingSetCard(gameObject.player.merchandise)
            outcome = {
                result: "win",
                title: "Victory!",
                description: `The ${category} expert is impressed. You win a card from your best set.`,
                reward,
                rewardType: "merchandise"
            }
        } else {
            // non-matching category win
            const reward = getRandomByRarity(wagered.rarity, wagered.id)
            outcome = {
                result: "win",
                title: "Victory!",
                description: "You win — a fair trade at the right rarity.",
                reward,
                rewardType: "merchandise"
            }
        }
    } else if (playerRank === traderRank) {
        // tie — no exchange
        outcome = {
            result: "tie",
            title: "A Draw",
            description: "Equal value. The trader shrugs and you both walk away.",
            reward: null
        }
    } else {
        // player loses
        outcome = {
            result: "lose",
            title: "Defeated",
            description: "The trader's item was worth more. You hand over your card.",
            reward: null
        }
    }

    // update pending minigame with result and trader card
    gameObject.gameState.pendingMinigame = {
        ...minigame,
        phase: "result",
        wageredCardId,
        traderCard,
        outcome
    }

    // apply outcome
    if (outcome.result === "lose") {
        gameObject.removeMerchandise(wageredCardId)
    } else if (outcome.result === "win" && outcome.reward) {
        gameObject.addMerchandise(outcome.reward.id)
    }

    gameObject._notify()
}

export const MINIGAMES = {
    item_value_comparison: initItemValueComparison
}