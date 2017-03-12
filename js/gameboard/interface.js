export default function setupInterface(gameboard) {
  const startButton = createButton('START GAME', 'ui-button', e => {
    play(gameboard)
    gameboard.lastUpdate = performance.now()

    document.body.removeChild(e.target)
  })
  const gameOverButton = createButton('GAME OVER!', 'ui-button flashing disabled')
  const youWinButton = createButton('YOU WIN!!!', 'ui-button flashing disabled')

  document.body.appendChild(startButton)

  return {
    gameOver() {
      pause(gameboard)
      document.body.appendChild(gameOverButton)
    },
    win() {
      pause(gameboard)
      document.body.appendChild(youWinButton)
    }
  }
}

function play(gameboard) {
  return gameboard.pause = false
}
function pause(gameboard) {
  return gameboard.pause = true
}

function createButton(text, className, onclick) {
  const button = document.createElement('button')
  button.className = className
  button.onclick = onclick
  button.innerHTML = text

  return button
}
