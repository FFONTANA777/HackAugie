import { CARDS, SETS } from './Cards.js'
import { RELICS } from './Relics.js'
import { CONSUMABLES, STARTER_ITEMS } from './Consumables.js'
import { ENCOUNTERS } from './Encounters.js'

// =======
// Configs
// =======
const B_GOLD = 100
const B_FOOD = 10
const B_MERCH_DECK = 6
const B_CONS_DECK = 3
const B_RELIC_DECK = 3
const B_LEGS = 5

const PATH_CONFIGS = {
    short:  { min: 2, max: 3 },
    medium: { min: 4, max: 5 },
    long:   { min: 6, max: 7 }
}

// ==========
// Game State
// ==========
const gameObject = {

    // Player
    player: {
        gold: B_GOLD,
        food: B_FOOD,
        merchandise: [],
        consumables: [],
        relic: [],
        buffs: [],
        debuffs: [],
        decisionHistory: [],
        decks: {
            merchandise: B_MERCH_DECK,
            consumables: B_CONS_DECK,
            relics: B_RELIC_DECK
        }
    },

    // GameState
    gameState: {
        phase: "checkpoint",        // "checkpoint" | "travelling"
        legsRemaining: B_LEGS,
        currentLeg: {
            daysToNextTown: -1,     // -1 at checkpoints | 0 at last event
            eventQueue: []          // empty at last event | empty at checkpoints
        },
        currentCheckpoint: {
            pathOptions: []
        },
        loadout: {
            stagedRelic: null,
            relicLocked: false,
            stagedItem: null,
            itemLocked: false
        }
    },

    // Observer
    _listeners: [],
    subscribe(fn) {
        this._listeners.push(fn)
    },
    _notify() {
        this._listeners.forEach(fn => fn(this))
    },

    // Player mutations
    spendGold(amount) {
        this.player.gold -= amount
        this._notify()
    },
    gainGold(amount) {
        this.player.gold += amount
        this._notify()
    },
    spendFood(amount) {
        this.player.food -= amount
        this._notify()
    },
    gainFood(amount) {
        this.player.food += amount
        this._notify()
    },
    addMerchandise(cardId) {
        if (!CARDS[cardId]) return
        this.player.merchandise.push({ ...CARDS[cardId] })
        this._notify()
    },
    removeMerchandise(cardId) {
        const idx = this.player.merchandise.findIndex(c => c.id === cardId)
        if (idx !== -1) this.player.merchandise.splice(idx, 1)
        this._notify()
    },
    addConsumable(consumableId) {
        if (!CONSUMABLES[consumableId]) return
        this.player.consumables.push({ ...CONSUMABLES[consumableId] })
        this._notify()
    },
    useConsumable(consumableId) {
        const idx = this.player.consumables.findIndex(c => c.id === consumableId)
        if (idx !== -1) this.player.consumables.splice(idx, 1)
        this._notify()
    },
    confirmStarterItem() {
        if (this.gameState.loadout.itemLocked) return
        const id = this.gameState.loadout.stagedItem
        if (id) this.player.consumables.push({ ...STARTER_ITEMS[id] })
        this.gameState.loadout.itemLocked = true
        this._notify()
    },
    addRelic(relicId) {
        if (!RELICS[relicId]) return
        this.player.relic.push({ ...RELICS[relicId] })
        this._notify()
    },
    removeRelic(relicId) {
        const idx = this.player.relic.findIndex(c => c.id === relicId)
        if (idx !== -1) this.player.relic.splice(idx, 1)
        this._notify()
    },
    confirmRelic() {
        if (this.gameState.loadout.relicLocked) return
        const id = this.gameState.loadout.stagedRelic
        if (id) this.addRelic(id)
        this.gameState.loadout.relicLocked = true
        this._notify()
    },
    addDebuff(id, value, duration) {
        this.player.debuffs.push({ id, value, duration })
        this._notify()
    },
    addBuff(id, value, duration) {
        this.player.buffs.push({ id, value, duration })
        this._notify()
    },
    logDecision(decision) {
        this.player.decisionHistory.push(decision)
        this._notify()
    },
    clearExpiredEffects() {
        this.player.buffs = this.player.buffs.filter(b => b.duration !== "next_leg")
        this.player.debuffs = this.player.debuffs.filter(d => d.duration !== "next_leg")
        this._notify()
    },

    endGame(result) {
        this.gameState.phase = result === "win" ? "win" : "lose"
        this._notify()
    },

    arriveAtCheckpoint() {
        // clear the current leg
        this.gameState.currentLeg.daysToNextTown = -1
        this.gameState.currentLeg.eventQueue = []

        // set up checkpoint
        this.gameState.phase = "checkpoint"
        this.gameState.legsRemaining -= 1

        // check win condition first
        if (this.gameState.legsRemaining === 0) {
            this.endGame("win")
            return
        }
        
        this.gameState.currentCheckpoint = {
            pathOptions: [
                {
                    type: "short",
                    eventDensity: getEventDensity("short"),
                    cost: calculatePathCost(getEventDensity("short"), this)
                },
                {
                    type: "medium",
                    eventDensity: getEventDensity("medium"),
                    cost: calculatePathCost(getEventDensity("medium"), this)
                },
                {
                    type: "long",
                    eventDensity: getEventDensity("long"),
                    cost: calculatePathCost(getEventDensity("long"), this)
                }
            ]
        }

        // check lose condition against generated options
        if (checkLoseCondition(this)) {
            this.endGame("lose")
            return
        }

        this._notify()
    },

    startLeg(pathOption) {
        this.clearExpiredEffects()
        this.spendFood(pathOption.cost)

        this.gameState.phase = "travelling"
        this.gameState.currentLeg.daysToNextTown = pathOption.eventDensity
        this.gameState.currentLeg.eventQueue = generateEncounterQueue(pathOption.eventDensity)
        this.gameState.currentCheckpoint = null

        this._notify()
    },

    resolveEncounter() {
        // shift the completed encounter off the queue
        this.gameState.currentLeg.eventQueue.shift()

        // tick down days
        this.gameState.currentLeg.daysToNextTown -= 1

        // check if leg is complete
        if (this.gameState.currentLeg.eventQueue.length === 0) {
            this.arriveAtCheckpoint()
        } else {
            this._notify()
        }
    },
}

export default gameObject

export function generateEncounterQueue(eventDensity) {
    const pool = Object.keys(ENCOUNTERS)
    const queue = []

    for (let i = 0; i < eventDensity; i++) {
        const random = pool[Math.floor(Math.random() * pool.length)]
        queue.push(random)
    }

    return queue
}

export function calculatePathCost(eventDensity, gameObject) {
    const buffs = gameObject.player.buffs.reduce((sum, b) => sum + b.value, 0)
    const debuffs = gameObject.player.debuffs.reduce((sum, d) => sum + d.value, 0)
    return (2 * eventDensity) + buffs - debuffs
}

export function getEventDensity(pathType) {
    const { min, max } = PATH_CONFIGS[pathType]
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function initGame(selectedRelic, selectedConsumable) {
    // reset to base state
    gameObject.player.gold = B_GOLD
    gameObject.player.food = B_FOOD
    gameObject.player.merchandise = []
    gameObject.player.consumables = []
    gameObject.player.relic = []
    gameObject.player.buffs = []
    gameObject.player.debuffs = []
    gameObject.player.decisionHistory = []
    gameObject.player.decks = {
        merchandise: B_MERCH_DECK,
        consumables: B_CONS_DECK,
        relics: B_RELIC_DECK
    }
    gameObject.gameState.loadout = {
        stagedRelic: null,
        relicLocked: false,
        stagedItem: null,
        itemLocked: false
    }

    // apply starting selections
    gameObject.addRelic(selectedRelic)
    gameObject.addConsumable(selectedConsumable)

    // start on a medium path, travel cost waived
    const eventDensity = getEventDensity("medium")
    gameObject.gameState.phase = "travelling"
    gameObject.gameState.currentLeg.daysToNextTown = eventDensity
    gameObject.gameState.currentLeg.eventQueue = generateEncounterQueue(eventDensity)
    gameObject.gameState.currentCheckpoint = null

    gameObject._notify()
}