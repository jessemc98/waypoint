import createGrid from '../grid'
import createPlayer from '../player'

import drawGameBoard from './draw'
import { setupMovement } from './playerinput'
import setupInitialMap from './setupInitialMap'

export default (canvas) => ({
	canvas,
	ctx: canvas.getContext('2d'),
	width: canvas.width,
	height: canvas.height,
	grid: createGrid(32),
	junctions: [],
	draw: drawGameBoard,
	player: null,
	lastUpdate: performance.now(),
	init() {
		setupInitialMap.call(this)
		this.player = createPlayer(this)
		
		// setup movement listeners
		setupMovement(this)

		this.update.call(this)
	},
	update(dt) {
		// update every 200 ms
		if (dt - this.lastUpdate < 200) return requestAnimationFrame(this.update.bind(this))
		this.lastUpdate = dt

		this.player.update()

		// set player block to path block if it is currently grass
		const { x, y } = this.player.pos
		const node = this.grid.getGridNode(x, y)
		node.type === 'grass' && (node.type = 'path')


		this.draw()

		requestAnimationFrame(this.update.bind(this))
	}
})


// const spawnAppleAtBlock = (gameBoard, index) => {
// 	const i = index || Math.round(Math.random() * Math.pow(gameBoard.grid.size, 2)) - 1
// 	gameBoard.grid.nodes[i] = 2
// 	gameBoard.apples += 1
// }
