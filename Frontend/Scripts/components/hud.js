import gameObject from '../gameLogic/GameLogic.js'

function renderHUD() {
  const hud = document.createElement('div')
  hud.id = 'hud'
  hud.innerHTML = `
    <div class="hud-left">
      <span class="hud-item">💰 <span id="hud-gold">${gameObject.player.gold}</span></span>
      <span class="hud-item">🍞 <span id="hud-food">${gameObject.player.food}</span></span>
    </div>
    <div class="hud-center">
      <span id="hud-phase">${gameObject.gameState.phase}</span>
    </div>
    <div class="hud-right">
      <span class="hud-item">📦 <span id="hud-merch">${gameObject.player.merchandise.length}</span>/<span>${gameObject.player.decks.merchandise}</span></span>
      <span class="hud-item">🎒 <span id="hud-cons">${gameObject.player.consumables.length}</span>/<span>${gameObject.player.decks.consumables}</span></span>
      <span class="hud-item">💎 <span id="hud-relics">${gameObject.player.abilities.length}</span>/<span>${gameObject.player.decks.relics}</span></span>
    </div>
  `

  gameObject.subscribe((state) => {
    document.getElementById('hud-gold').textContent = state.player.gold
    document.getElementById('hud-food').textContent = state.player.food
    document.getElementById('hud-phase').textContent = state.gameState.phase
    document.getElementById('hud-merch').textContent = state.player.merchandise.length
    document.getElementById('hud-cons').textContent = state.player.consumables.length
    document.getElementById('hud-relics').textContent = state.player.abilities.length
  })

  return hud
}

export default renderHUD