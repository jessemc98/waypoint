import colors from './colors'

// create player
export default (gameBoard) => {
	const initialPos = {
		x: 0,
		y: gameBoard.grid.size / 2 - 1
	}

	return {
		pos: initialPos,
		vel: { x: 0, y: 0 },
		draw() {
			const { ctx } = gameBoard
			const { x, y } = this.pos
			const size = gameBoard.width / gameBoard.grid.size

			ctx.fillStyle = colors['player']
			ctx.fillRect(x * size + 5, y * size + 5, size - 10, size - 10)
		},
		move(dir) {
			this.dir = dir
			this.vel.x = this.vel.y = 0
			// if no direction stop moving
			if (!dir) {
				return this.dir = null
			}

			this['move' + dir]()
		},
		moveUp() {
			return this.pos.y !== 0 && (this.vel.y = -1)
		},
		moveRight() {
			return this.pos.x !== gameBoard.grid.size - 1 && (this.vel.x = 1)
		},
		moveDown() {
			return this.pos.y !== gameBoard.grid.size - 1 && (this.vel.y = 1)
		},
		moveLeft() {
			return this.pos.x !== 0 && (this.vel.x = -1)
		},
		update() {
			this.move(this.dir)

			this.pos.x += this.vel.x
			this.pos.y += this.vel.y
		}
	}
}
