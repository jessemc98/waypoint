import { createPlayer as createPlayerNode } from './node'
import colors from './colors'
import { 
	linkJunctionToNeighbours, 
	updateJunctionNeighbours, 
	createJunctionIfNotPresent, 
	checkNodeForJunctions } from './junctions'

// create player
export default (gameBoard) => {
	const initialPos = {
		x: 0,
		y: gameBoard.grid.size / 2 - 1
	}
	
	return {
		node: createPlayerNode(0, gameBoard.grid.size / 2 - 1),
		pos: initialPos,
		prev: initialPos,
		vel: { x: 0, y: 0 },
		draw() {
			const { ctx } = gameBoard
			const { x, y } = this.pos
			const size = gameBoard.width / gameBoard.grid.size

			ctx.fillStyle = colors[this.node.type]
			ctx.fillRect(x * size + 5, y * size + 5, size - 10, size - 10)
		},
		getCurrentNode() {
			return gameBoard.grid.getGridNode(this.pos.x, this.pos.y)
		},
		getNextNode() {
			return gameBoard.grid.getGridNode(this.pos.x + this.vel.x, this.pos.y + this.vel.y)
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
		updatePos(pos) {
			pos.x += this.vel.x
			pos.y += this.vel.y
		},
		updateNode() {
			this.node.Left = this.node.Right = this.node.Up = this.node.Down = null

			updateJunctionNeighbours(this.node, gameBoard, this.node)
			this.updatePos(this.node)
			updateJunctionNeighbours(this.node, gameBoard, this.node)

			checkNodeForJunctions(this.node, gameBoard)
				.map(junction => createJunctionIfNotPresent(junction.x, junction.y, gameBoard, this.node))
				.map(junction => updateJunctionNeighbours(junction, gameBoard, this.node))

			linkJunctionToNeighbours(this.node, gameBoard)
		},
		update() {
			this.updateNode()

			this.move(this.dir)
			this.updatePos(this.pos)
		}
	}
}
