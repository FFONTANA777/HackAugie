import { CARDS, SETS } from './Cards.js'
import { RELICS } from './Relics.js'
import { CONSUMABLES, STARTER_ITEMS } from './Consumables.js'

// =======
// Configs
// =======
const B_GOLD = 100
const B_FOOD = 10
const B_MERCH_DECK = 6
const B_CONS_DECK = 3
const B_RELIC_DECK = 3

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
        decks: {
            merchandise: B_MERCH_DECK,
            consumables: B_CONS_DECK,
            relics: B_RELIC_DECK
        }
    },

    // GameState
    gameState: {
        phase: "checkpoint",        // "checkpoint" | "travelling"
        currentLeg: {
            daysToNextTown: -1,     // -1 at checkpoints | 0 at last event
            eventQueue: []          // empty at last event | empty at checkpoints
        },
        currentCheckpoint: {
            shopInventory: {
                consumables: [],
                relic: []
            },
            pathOptions: []
        },
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
    
    // Phase transitions
    startLeg() {
        // TODO
    },
    arriveAtCheckpoint() {
        // TODO
    },

    // Encounter queue
    generateEncounterQueue() {
        //TODO
    },

    // Shop
    generateShopInventory() {
        // placeholder — Conductor will eventually drive this
        return {
            consumables: [],
            relic: []
        }
    },
}

export default gameObject