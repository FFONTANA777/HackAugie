const GameLogic = {
  // --- Player Resources ---
  money: 100,
  food: 10,
  water: 10,

  // --- Travel ---
  day: 1,
  route: null,        // 'short' | 'medium' | 'long'
  eventsRemaining: 0,
  daysToNextTown: 0,

  // --- Decks ---
  merchandise: [],    // { id, name, category, value, setId }
  consumables: [],    // { id, name, effect }
  abilities: [],      // { id, name, bonus }  max 3

  // --- Current Event ---
  currentEvent: null, // { type, description, choices: [], outcome: null }

  // --- Game Phase ---
  phase: 'menu',      // 'menu' | 'travel' | 'event' | 'town' | 'end'

  // --- Score ---
  highscore: 0,

  // --- Methods ---
  update(changes) {
    Object.assign(this, changes)
    this._notify()
  },

  _listeners: [],
  subscribe(fn) {
    this._listeners.push(fn)
  },
  _notify() {
    this._listeners.forEach(fn => fn(this))
  },
}

export default GameLogic