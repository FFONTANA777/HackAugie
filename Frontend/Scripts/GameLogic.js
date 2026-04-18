import { CARDS, SETS } from './Cards.js'

// =======
// Configs
// =======
// Player Base Stats
const B_GOLD = 100
const B_FOOD = 10
const B_MERCH_DECK = 6
const B_CONS_DECK = 3
const B_RELIC_DECK = 3

// =======
// Objects
// =======
const playerState = {
  gold: B_GOLD,
  food: B_FOOD,
  merchandise: [],
  consumables: [],
  abilities: [],
  decisionHistory: [],
  daysToNextTown: 0,
  encountersRemaining: 0,
  decks: {
    merchandise: B_MERCH_DECK,
    consumables: B_CONS_DECK,
    relics: B_RELIC_DECK
  }
}

