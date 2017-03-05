import { createPlayer as createPlayerNode } from './node'
import colors from './colors'

// create player
export default (gameBoard) => {
	const getGridNode = gameBoard.grid.getGridNode.bind(gameBoard.grid)
	const setGridNode = gameBoard.grid.setGridNode.bind(gameBoard.grid)
	const initialPos = {
		x: 0,
		y: gameBoard.grid.size / 2 - 1
	}
	const node = createPlayerNode(0, gameBoard.grid.size / 2 - 1)
	node.linkUp(getGridNode(0, 0))
	node.linkDown(getGridNode(0,31))
	

	const updateNode = function () {
		const current = this.getCurrentNode()
		const next = this.getNextNode()

		// if moving from junction to junction, do nothing
		// if(current.type === 'junction' && next.type === 'junction') return

		// if moving from junction to path
		if(current.type === 'junction' && next.type === 'path') {
			const opposite = true
			console.log(this)
			this.node.clearLinks()

			current[this.dir].link(this.dir, this.node, opposite)
			current.link(this.dir, node)
		}
		// if moving from path to grass
		if(current.type === 'path' &&
			next.type === 'grass') {
		//TODO if moving from path to grass but in same axis as previous step do nothing
			let copy = Object.assign(createPlayerNode(), this.node)
			this.node.type = 'junction'

			setGridNode(this.pos.x, this.pos.y, this.node)
			this.node = copy
		}
		// move player node
		this.node.x += this.vel.x
		this.node.y += this.vel.y
	}
	return {
		node,
		pos: initialPos,
		vel: { x: 0, y: 0 },
		getCurrentNode() {
			return getGridNode(this.pos.x, this.pos.y)
		},
		getNextNode() {
			return getGridNode(this.pos.x + this.vel.x, this.pos.y + this.vel.y)
		},
		move(dir) {
			this.dir = dir
			// if no direction stop moving
			if (!dir) {
				return this.vel.x = this.vel.y = 0 }

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
			updateNode.call(this)
			this.pos.x += this.vel.x
			this.pos.y += this.vel.y
		},
		draw() {
			const { ctx } = gameBoard
			const { x, y } = this.pos
			const size = gameBoard.width / gameBoard.grid.size

			ctx.fillStyle = colors[this.node.type]
			ctx.fillRect(x * size + 5, y * size + 5, size - 10, size - 10)
		}
	}
}
