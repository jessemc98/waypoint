export function setupMovement(gameBoard) {
	const state = []
	document.addEventListener('keydown', e => {
		if (e.key === 'w' || e.key === 'a' || e.key === 's' || e.key === 'd') {
			if (state.indexOf(e.key) === -1) {
				state.unshift(e.key)
			}
		}

		movePlayer(state[0], gameBoard.player)
	})
	document.addEventListener('keyup', e => {
		const i = state.indexOf(e.key)
		if (i > -1) {
			state.splice(i, 1)
		}
		movePlayer(state[0], gameBoard.player)
	})
}

function movePlayer(dir, player) {
	switch(dir) {
		case('w'):
			return player.move('Up')
		case('d'):
			return player.move('Right')
		case('s'):
			return player.move('Down')
		case('a'):
			return player.move('Left')
		default:
			return player.move()
	}
}
