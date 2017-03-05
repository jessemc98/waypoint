export function setupMovement(gameBoard) {
	document.addEventListener('keydown', e => {
		switch(e.key) {
			case('w'):
				return gameBoard.player.move('Up')
			case('d'):
				return gameBoard.player.move('Right')
			case('s'):
				return gameBoard.player.move('Down')
			case('a'):
				return gameBoard.player.move('Left')
		}
	})
	document.addEventListener('keyup', () => gameBoard.player.move())

	requestAnimationFrame(gameBoard.update.bind(gameBoard))
}