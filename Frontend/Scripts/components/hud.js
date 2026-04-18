import GameLogic from '../GameLogic/GameLogic.js'

function renderHUD() {
  const hud = document.createElement('div')
  hud.id = 'hud'
  hud.innerHTML = `
    <div class="hud-left">
      <span class="hud-item">💰 <span id="hud-money">${GameLogic.money}</span></span>
      <span class="hud-item">🍞 <span id="hud-food">${GameLogic.food}</span></span>
      <span class="hud-item">💧 <span id="hud-water">${GameLogic.water}</span></span>
    </div>
    <div class="hud-center">
      <span id="hud-day">Day ${GameLogic.day}</span>
    </div>
    <div class="hud-right">
      <span class="hud-item">📦 <span id="hud-merch">${GameLogic.merchandise.length}</span></span>
      <span class="hud-item">🎒 <span id="hud-cons">${GameLogic.consumables.length}</span></span>
    </div>
  `

  // re-renders whenever state changes
  GameLogic.subscribe((state) => {
    document.getElementById('hud-money').textContent = state.money
    document.getElementById('hud-food').textContent = state.food
    document.getElementById('hud-water').textContent = state.water
    document.getElementById('hud-day').textContent = `Day ${state.day}`
    document.getElementById('hud-merch').textContent = state.merchandise.length
    document.getElementById('hud-cons').textContent = state.consumables.length
  })

  return hud
}

export default renderHUD