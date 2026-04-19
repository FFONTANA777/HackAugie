import { CARDS, SETS, RARITY_VALUES } from './Cards.js'
import { RELICS } from './Relics.js'
import { CONSUMABLES, STARTER_ITEMS } from './Consumables.js'
import { ENCOUNTERS } from './Encounters.js'

// =======
// Configs
// =======
const B_GOLD = 80
const B_FOOD = 15
const B_MERCH_DECK = 6
const B_CONS_DECK = 2
const B_RELIC_DECK = 2
const B_LEGS = 5
const SAVE_VERSION = 1

const PATH_CONFIGS = {
    short:  { min: 4, max: 6 },
    medium: { min: 7, max: 9 },
    long:   { min: 10, max: 12 }
}

const FOOD_OFFERS = {
    small_rations:  { id: "small_rations",  name: "Small Rations",  amount: 3,  price: 10 },
    medium_rations: { id: "medium_rations", name: "Medium Rations", amount: 6,  price: 18 },
    large_rations:  { id: "large_rations",  name: "Large Rations",  amount: 12, price: 32 }
}

// Wagon upgrade config. DECK_LIMITS defines min/max size per deck.
// UPGRADE_COSTS is keyed by current size — "when you have X slots, upgrading costs Y".
// If UPGRADE_COSTS[type][currentSize] is undefined, deck is maxed.
const DECK_LIMITS = {
    merchandise: { min: 3, max: 6 },
    consumables: { min: 2, max: 4 },
    relics:      { min: 2, max: 4 }
}
const UPGRADE_COSTS = {
    merchandise: { 3: 50, 4: 80, 5: 120 },
    consumables: { 2: 60, 3: 100 },
    relics:      { 2: 80, 3: 150 }
}

// Merchandise appearance weights for shop rolls. Higher = more common.
// Mythic excluded entirely — mythic cards are find-only (shrines, encounters),
// never purchasable, to prevent buy-and-hold exploits on cards like Lost Crown.
const RARITY_WEIGHTS = {
    common:    10,
    uncommon:  6,
    rare:      3,
    epic:      1,
    legendary: 1
}
// Markup on sell value to set merchandise buy price. 1.5x means a rare (45g)
// buys for 68g before any relic modifiers.
export const MERCH_BUY_MARKUP = 1.5

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
        },
        sellCount: 0,          // for coin_purse
        townsVisited: 0,       // for dorans_stonks
        chosenSet: null,       // for specialists_mark (picked at loadout)
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
        pendingOffer: null,
        pendingTrade: null,
        pendingShop: null,
        pendingMinigame: null,
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
        sessionStorage.setItem('gameState', JSON.stringify({
            version: SAVE_VERSION,
            player: this.player,
            gameState: this.gameState
        }))
    },

    // Player mutations
    gainGold(amount) {
        const modified = this._applyGoldModifiers(amount, "gain")
        this.player.gold += modified
        this._notify()
    },
    spendGold(amount) {
        const modified = this._applyGoldModifiers(amount, "spend")
        this.player.gold -= modified
        this._notify()
    },
    _applyGoldModifiers(amount, direction) {
        let modified = amount
        for (const relic of this.player.relic) {
            if (relic.effect === "curse_gambit") {
                modified = direction === "gain"
                    ? Math.floor(modified * 0.5)
                    : Math.ceil(modified * 2)
            }
        }
        return modified
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
        if (this.player.merchandise.length >= this.player.decks.merchandise) return
        this.player.merchandise.push({ ...CARDS[cardId] })
        this._notify()
    },
    removeMerchandise(cardId) {
        const idx = this.player.merchandise.findIndex(c => c.id === cardId)
        if (idx !== -1) this.player.merchandise.splice(idx, 1)
        this._notify()
    },
    addConsumable(consumableId) {
        const item = CONSUMABLES[consumableId] ?? STARTER_ITEMS[consumableId]
        if (!item) return
        if (this.player.consumables.length >= this.player.decks.consumables) return
        this.player.consumables.push({ ...item })
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
        if (this.player.relic.length >= this.player.decks.relics) return
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

    // Shop
    buyShopSlot(slotIndex) {
        const slot = this.gameState.currentCheckpoint?.shopInventory?.[slotIndex]
        if (!slot) return
        if (this.player.gold < slot.displayPrice) return  // can't afford

        // FOOD — unlimited buys per visit, never flips to sold
        if (slot.type === "food") {
            this.spendGold(slot.displayPrice)
            this.gainFood(slot.amount)
            return
        }

        // CONSUMABLE or MERCHANDISE — one-per-visit, shared lock
        if (slot.sold) return
        const anyNonFoodSold = this.gameState.currentCheckpoint.shopInventory.some(
            s => s.sold && s.type !== "food"
        )
        if (anyNonFoodSold) return

        if (slot.type === "consumable") {
            if (this.player.consumables.length >= this.player.decks.consumables) return
            this.spendGold(slot.displayPrice)
            this.addConsumable(slot.id)
        } else if (slot.type === "merchandise") {
            if (this.player.merchandise.length >= this.player.decks.merchandise) return
            this.spendGold(slot.displayPrice)
            this.addMerchandise(slot.id)
        }

        slot.sold = true
        this._notify()
    },

    sellMerchandise(cardIndex) {
        const card = this.player.merchandise[cardIndex]
        if (!card) return
        const value = getSellValue(card, false, this)
        this.player.merchandise.splice(cardIndex, 1)
        this.player.sellCount += 1
        this.gainGold(value)
    },

    upgradeWagon(deckType) {
        const checkpoint = this.gameState.currentCheckpoint
        if (!checkpoint || checkpoint.upgradeUsed) return
        if (!DECK_LIMITS[deckType]) return  // unknown deck

        const currentSize = this.player.decks[deckType]
        if (currentSize >= DECK_LIMITS[deckType].max) return  // already maxed

        const cost = UPGRADE_COSTS[deckType][currentSize]
        if (cost === undefined) return  // no upgrade defined for this size
        if (this.player.gold < cost) return  // can't afford

        this.player.decks[deckType] += 1
        checkpoint.upgradeUsed = true
        this.spendGold(cost)  // notifies
    },

    arriveAtCheckpoint() {
        this.gameState.currentLeg.daysToNextTown = -1
        this.gameState.currentLeg.eventQueue = []

        this.gameState.phase = "checkpoint"
        this.gameState.legsRemaining -= 1
        this.player.townsVisited += 1

        // win condition — final sale pass
        if (this.gameState.legsRemaining === 0) {
            this.player.merchandise.forEach(card => {
                this.player.gold += getSellValue(card, true, this)
            })
            this.player.merchandise = []
            this.endGame("win")
            return
        }

        const shortDensity  = getEventDensity("short")
        const mediumDensity = getEventDensity("medium")
        const longDensity   = getEventDensity("long")

        this.gameState.currentCheckpoint = {
            pathOptions: [
                { type: "short",  eventDensity: shortDensity,  cost: calculatePathCost(shortDensity,  this) },
                { type: "medium", eventDensity: mediumDensity, cost: calculatePathCost(mediumDensity, this) },
                { type: "long",   eventDensity: longDensity,   cost: calculatePathCost(longDensity,   this) }
            ],
            shopInventory: generateShopInventoryRandom().map(slot => ({
                ...slot,
                displayPrice: getBuyPrice(slot.price, this)
            })),
            upgradeUsed: false
            // shopInventory: await generateShopInventoryEngine(this)  // engine version — needs arriveAtCheckpoint to be async
        }

        if (checkLoseCondition(this)) {
            this.endGame("lose")
            return
        }

        this._notify()
    },

    startLeg(pathOption) {
        this.clearExpiredEffects()
        this.applyPassiveEffects()
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

    applyPassiveEffects() {
        for (const relic of this.player.relic) {
            switch (relic.effect) {
                case "curse_gold_drain":
                    this.spendGold(2)
                    break
                case "curse_hunger":
                    // already handled in calculatePathCost via debuff
                    // add a permanent debuff if not already present
                    if (!this.player.debuffs.some(d => d.id === "curse_hunger")) {
                        this.player.debuffs.push({
                            id: "curse_hunger",
                            value: 1,
                            duration: "permanent"
                        })
                    }
                    break
            }
        }
        this._notify()
    },
}

// rehydrate on load
const _saved = sessionStorage.getItem('gameState')
if (_saved) {
    try {
        const _parsed = JSON.parse(_saved)
        if (_parsed.version === SAVE_VERSION) {
            gameObject.player = _parsed.player
            gameObject.gameState = _parsed.gameState
        } else {
            // version mismatch — drop the stale save
            sessionStorage.removeItem('gameState')
        }
    } catch (e) {
        console.warn('Failed to rehydrate save, starting fresh:', e)
        sessionStorage.removeItem('gameState')
    }
}

export default gameObject

export { CONSUMABLES, FOOD_OFFERS, CARDS }

export function getBuyPrice(basePrice, gameObject) {
    let price = basePrice
    const relics = gameObject.player.relic

    if (relics.some(r => r.id === "empty_pockets") && gameObject.player.gold < 20) {
        price -= 10
    }
    if (relics.some(r => r.id === "bad_omen")) {
        price += 25
    }
    if (relics.some(r => r.id === "friends")) {
        price -= 5
    }

    return Math.max(1, price)
}

// Returns upgrade cost for the given deck's current size, or null if maxed.
export function getUpgradeCost(deckType, currentSize) {
    return UPGRADE_COSTS[deckType]?.[currentSize] ?? null
}

// Returns max size for a deck type (for UI display).
export function getDeckMax(deckType) {
    return DECK_LIMITS[deckType]?.max ?? 0
}

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
    return  Math.floor(eventDensity / 2) + buffs - debuffs
}

export function getEventDensity(pathType) {
    const { min, max } = PATH_CONFIGS[pathType]
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function initGame(selectedRelic, selectedConsumable) {
    sessionStorage.removeItem('gameState')

    // reset to base state
    gameObject.player.gold = B_GOLD
    gameObject.player.food = B_FOOD
    gameObject.player.merchandise = []
    gameObject.player.consumables = []
    gameObject.player.relic = []
    gameObject.player.buffs = []
    gameObject.player.debuffs = []
    gameObject.player.decisionHistory = []
    gameObject.player.sellCount = 0
    gameObject.player.townsVisited = 0
    gameObject.player.chosenSet = null
    gameObject.gameState.legsRemaining = B_LEGS
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

export function checkLoseCondition(gameObject) {
    const cheapest = Math.min(
        ...gameObject.gameState.currentCheckpoint.pathOptions.map(o => o.cost)
    )
    // liquid value — gold player could reasonably raise by selling merchandise
    const liquidGold = gameObject.player.gold + gameObject.player.merchandise.reduce(
        (sum, card) => sum + getSellValue(card, false, gameObject),
        0
    )
    // convert gold to food-equivalent at small_rations rate (10 gold for 3 food)
    const foodFromGold = Math.floor(liquidGold / (10 / 3))
    const effectiveFood = gameObject.player.food + foodFromGold
    return effectiveFood < cheapest
}

// Shop
function hasCompleteSet(cardId, merchandise) {
    const card = CARDS[cardId]
    if (!card || !card.set) return false
    const set = SETS[card.set]
    if (!set) return false
    return set.cards.every(setCardId =>
        merchandise.some(m => m.id === setCardId)
    )
}

export function getSellValue(card, isFinalSale = false, gameObject = null) {
    const rarityKey = isFinalSale ? card.rarity : (card.sellRarity || card.rarity)
    let value = RARITY_VALUES[rarityKey]

    // Set bonus — only when full set is currently in the deck
    if (gameObject && card.set && hasCompleteSet(card.id, gameObject.player.merchandise)) {
        value = Math.floor(value * SETS[card.set].sellBonus)
    }

    if (!gameObject) return value

    const relics = gameObject.player.relic
    const consumables = gameObject.player.consumables

    // Specialist's Mark (starter) — multiplier on the base
    if (gameObject.player.chosenSet) {
        value = card.set === gameObject.player.chosenSet
            ? value * 2
            : Math.floor(value * 0.5)
    }

    // Doran's Stonks (starter)
    if (consumables.some(c => c.id === "dorans_stonks")) {
        value = gameObject.player.townsVisited <= 1
            ? Math.floor(value * 0.8)
            : Math.floor(value * 1.5)
    }

    // Back to Basics (starter)
    if (consumables.some(c => c.id === "back_to_basics")) {
        value = Math.floor(value * 1.15)
    }

    // Merchant's Scales relic
    if (relics.some(r => r.id === "merchant_scales")) {
        value += 20
    }

    // Coin Purse relic — every 3rd sell
    if (relics.some(r => r.id === "coin_purse")) {
        if ((gameObject.player.sellCount + 1) % 3 === 0) {
            value += 5
        }
    }

    return value
}

// Fixed-shape shop: 1 food (unlimited buy), 1 consumable, 1 merchandise.
// Merchandise uses RARITY_WEIGHTS to bias toward commons; mythic excluded.
export function generateShopInventoryRandom() {
    const slots = []

    // Slot 1: food
    const foodIds = Object.keys(FOOD_OFFERS)
    const food = FOOD_OFFERS[foodIds[Math.floor(Math.random() * foodIds.length)]]
    slots.push({
        type: "food",
        id: food.id,
        name: food.name,
        amount: food.amount,
        icon: "🍞", // Default food icon
        description: `Restores ${food.amount} food.`,
        price: food.price,
        sold: false
    })

    // Slot 2: consumable
    const consumableIds = Object.keys(CONSUMABLES)
    const cons = CONSUMABLES[consumableIds[Math.floor(Math.random() * consumableIds.length)]]
    slots.push({
        type: "consumable",
        id: cons.id,
        name: cons.name,
        price: cons.baseValue,
        icon: cons.icon || "🧪",
        description: cons.description || "",
        sold: false
    })

    // Slot 3: merchandise (rarity-weighted)
    const merch = pickWeightedMerchandise()
    slots.push({
        type: "merchandise",
        id: merch.id,
        name: merch.name,
        icon: merch.icon || "📦",
        description: merch.description || "",
        rarity: merch.rarity,
        price: Math.floor(RARITY_VALUES[merch.rarity] * MERCH_BUY_MARKUP),
        sold: false
    })

    return slots
}

function pickWeightedMerchandise() {
    // Build a flat weighted pool: each card appears N times where N is its rarity weight.
    const pool = []
    for (const card of Object.values(CARDS)) {
        if (card.rarity === "mythic") continue  // mythic is never sold
        const weight = RARITY_WEIGHTS[card.rarity] ?? 1
        for (let i = 0; i < weight; i++) pool.push(card)
    }
    return pool[Math.floor(Math.random() * pool.length)]
}