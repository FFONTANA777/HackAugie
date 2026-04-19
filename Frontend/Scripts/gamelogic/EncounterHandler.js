import { ENCOUNTERS } from './Encounters.js'
import { MINIGAMES } from './Minigames.js'
import { CARDS } from './Cards.js'
import { RELICS } from './Relics.js'
import gameObject, { MERCH_BUY_MARKUP } from './GameLogic.js'

// ================
// Condition Checks
// ================

function checkCondition(condition, player) {
    switch (condition.type) {
        case "has_consumable_effect":
            return player.consumables.some(c => 
                Array.isArray(c.effect) 
                    ? c.effect.includes(condition.id)
                    : c.effect === condition.id
            )

        case "has_consumable_id":
            return player.consumables.some(c => c.id === condition.id)

        case "has_merch_type":
            return player.merchandise.some(m => m.type === condition.id)

        case "has_merch_id":
            return player.merchandise.some(m => m.id === condition.id)

        case "random":
            return Math.random() < condition.chance

        case "default":
            return true

        default:
            console.warn(`Unknown condition type: ${condition.type}`)
            return false
    }
}

// ===============
// Effect Appliers
// ===============

function applyEffects(effects, gameObject) {
    for (const effect of effects) {
        switch (effect.type) {
            case "default":
                // no effect, free outcome
                break

            case "lose_gold":
                gameObject.spendGold(effect.value)
                break

            case "gain_gold":
                gameObject.gainGold(effect.value)
                break

            case "lose_food":
                gameObject.spendFood(effect.value)
                break

            case "gain_food":
                gameObject.gainFood(effect.value)
                break

            case "lose_merch_random":
                _removeMerchRandom(effect, gameObject)
                break

            case "gain_merch_specific":
                gameObject.addMerchandise(effect.id)
                break

            case "use_consumable":
                gameObject.useConsumable(effect.id)
                break

            case "debuff":
                gameObject.addDebuff(effect.id, effect.value, effect.duration)
                break

            case "offer_merchandise": {
                const pool = Object.values(CARDS).filter(c => c.type === "merchandise")
                const shuffled = [...pool].sort(() => Math.random() - 0.5)
                gameObject.gameState.pendingOffer = {
                    candidates: shuffled.slice(0, effect.count),
                    pick: effect.pick
                }
                gameObject._notify()
                break
            }
            
            case "offer_relic": {
                const pool = Object.values(RELICS).filter(r => !r.cursed)
                const shuffled = [...pool].sort(() => Math.random() - 0.5)
                gameObject.gameState.pendingOffer = {
                    candidates: shuffled.slice(0, effect.count),
                    pick: effect.pick,
                    offerType: "relic"
                }
                gameObject._notify()
                break
            }

            case "offer_merchandise_type": {
                const pool = Object.values(CARDS).filter(c =>
                    c.type === "merchandise" && c.category === effect.category
                )
                const shuffled = [...pool].sort(() => Math.random() - 0.5)
                gameObject.gameState.pendingOffer = {
                    candidates: shuffled.slice(0, effect.count),
                    pick: effect.pick,
                    offerType: "merchandise"
                }
                gameObject._notify()
                break
            }

            case "open_shop_merchandise": {
                const pool = Object.values(CARDS).filter(c => c.type === "merchandise")
                const shuffled = [...pool].sort(() => Math.random() - 0.5)
                gameObject.gameState.pendingShop = {
                    items: shuffled.slice(0, 4),
                    currency: "gold",
                    markup: SHOP_MARKUP
                }
                gameObject._notify()
                break
            }

            case "open_miner_trade": {
                const pool = Object.values(CARDS).filter(c => c.type === "merchandise")
                const shuffled = [...pool].sort(() => Math.random() - 0.5)
                gameObject.gameState.pendingShop = {
                    items: shuffled.slice(0, 3),
                    currency: "food",
                    markup: 1.0  // food cost uses base rarity value directly
                }
                gameObject._notify()
                break
            }

            case "gain_curse": {
                const pool = Object.values(RELICS).filter(r => r.cursed)
                const random = pool[Math.floor(Math.random() * pool.length)]
                gameObject.addRelic(random.id)
                gameObject._notify()
                break
            }

            case "gain_curse_forced": {
                gameObject.addRelic("gambits_debt")
                gameObject._notify()
                break
            }

            case "lift_curse": {
                const curses = gameObject.player.relic.filter(r => r.cursed)
                if (curses.length === 0) break
                // remove the most recently added curse
                const target = curses[curses.length - 1]
                gameObject.removeRelic(target.id)
                gameObject.useConsumable("totem_of_undying")
                gameObject._notify()
                break
            }

            default:
                console.warn(`Unknown effect type: ${effect.type}`)
        }
    }
}

function _removeMerchRandom(effect, gameObject) {
    const pool = effect.id
        ? gameObject.player.merchandise.filter(m => m.type === effect.id)
        : gameObject.player.merchandise

    if (pool.length === 0) return

    const target = pool[Math.floor(Math.random() * pool.length)]
    gameObject.removeMerchandise(target.id)
}

// ================
// Outcome Resolver
// ================

function resolveOutcome(option, player) {
    // resolve any random_split upfront
    let splitResult = null
    const splitCondition = option.outcomes.find(o => o.condition.type === "random_split")
    if (splitCondition) {
        const branches = splitCondition.condition.branches
        const roll = Math.random()
        let cumulative = 0
        for (let i = 0; i < branches.length; i++) {
            cumulative += branches[i]
            if (roll < cumulative) { splitResult = i; break }
        }
    }

    for (const outcome of option.outcomes) {
        if (outcome.condition.type === "random_split") {
            if (outcome.condition.index === splitResult) return outcome.result
        } else {
            if (checkCondition(outcome.condition, player)) return outcome.result
        }
    }

    console.warn("No outcome resolved — check that every option has a default condition.")
    return null
}

// ============
// Main Handler
// ============

function handleEncounter(encounterId, optionIndex, gameObject) {
    const encounter = ENCOUNTERS[encounterId]

    if (!encounter) {
        console.error(`Encounter not found: ${encounterId}`)
        return null
    }

    // minigame encounters — hand off to minigame handler
    if (encounter.type === "minigame") {
        const minigame = MINIGAMES[encounter.minigame]
        if (!minigame) {
            console.error(`Minigame not found: ${encounter.minigame}`)
            return null
        }
        return minigame(encounter, gameObject)
    }

    // decision encounters
    if (encounter.type === "decision") {
        const option = encounter.options[optionIndex]

        if (!option) {
            console.error(`Option index ${optionIndex} not found on encounter: ${encounterId}`)
            return null
        }

        const result = resolveOutcome(option, gameObject.player)
        if (!result) return null

        applyEffects(result.effects, gameObject)
        gameObject.logDecision(option.label)
        gameObject.resolveEncounter()

        return result // return so UI can display outcome description
    }

    console.error(`Unknown encounter type: ${encounter.type}`)
    return null
}

export { handleEncounter, checkCondition, applyEffects }
