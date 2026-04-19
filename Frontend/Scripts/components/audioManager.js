let audio = null

export function initMusic() {
  if (!audio) {
    audio = new Audio('/Frontend/public/sounds/medieval-folk-music.mp3')
    audio.loop = true
    audio.volume = 0.5

    // restore playback position
    const savedTime = sessionStorage.getItem('music-time')
    if (savedTime) audio.currentTime = parseFloat(savedTime)

    audio.play().catch(() => {
      // autoplay blocked until user interaction
      document.addEventListener('click', () => audio.play(), { once: true })
    })

    // save progress continuously
    setInterval(() => {
      sessionStorage.setItem('music-time', audio.currentTime)
    }, 1000)
  }
}

export function getMusic() {
  return audio
}