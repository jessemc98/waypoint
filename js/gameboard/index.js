import createGrid from '../grid'
import createPlayer from '../player'
import createEnemy from '../enemy'

import drawGameBoard from './draw'
import { setupMovement } from './playerinput'
import setupInitialMap from './setupInitialMap'

const GRID_SIZE = 32
const GAME_STEP = (1000/60) * 9
const PLAYER_STEP = (1000/60) * 9
const ENEMY_STEP = (1000/60) * 11

export default (canvas) => ({
	canvas,
	ctx: canvas.getContext('2d'),
	width: canvas.width,
	height: canvas.height,
	grid: createGrid(GRID_SIZE),
	junctions: [],
	enemies: [],
	draw: drawGameBoard,
	player: null,
	lastUpdate: {
		game: performance.now(),
		player: performance.now(),
		enemies: performance.now()
	},
	init() {
		setupInitialMap.call(this)
		this.player = createPlayer(this)
		createEnemy(GRID_SIZE - 1, GRID_SIZE - 1, this)
		// setup movement listeners
		setupMovement(this)

		this.update.call(this)
	},
	update(dt) {
		// update every 100 ms
		if (dt - this.lastUpdate.game > GAME_STEP) {
			this.lastUpdate.game = dt
		}


		if (dt - this.lastUpdate.player > PLAYER_STEP) {
			this.lastUpdate.player = dt
			this.player.update()

			// set player block to path block if it is currently grass
			const { x, y } = this.player.pos
			const node = this.grid.getGridNode(x, y)
			// console.log(node, x, y)
			node.type === 'grass' && (node.type = 'path')
		}

		if (dt - this.lastUpdate.enemies > ENEMY_STEP) {
			this.lastUpdate.enemies = dt
			this.enemies
			.forEach(enemy => enemy.update())
		}

		// this.enemies.forEach(enemy => enemy.getWayPointsToPlayer())
		this.draw()


		requestAnimationFrame(this.update.bind(this))
	}
})


// const spawnAppleAtBlock = (gameBoard, index) => {
// 	const i = index || Math.round(Math.random() * Math.pow(gameBoard.grid.size, 2)) - 1
// 	gameBoard.grid.nodes[i] = 2
// 	gameBoard.apples += 1
// }
