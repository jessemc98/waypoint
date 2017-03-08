import createPlayer from '../player'
import createEnemy from '../enemy'

import drawGameBoard from './draw'
import { setupMovement } from './playerinput'
import waypointSystem, { createWaypointGrid } from './junctionWaypoints'

const GRID_SIZE = 16
const GAME_STEP = (1000/60) * 12
const PLAYER_STEP = (1000/60) * 9
const ENEMY_STEP = (1000/60) * 11

export default (canvas) => ({
	canvas,
	ctx: canvas.getContext('2d'),
	width: canvas.width,
	height: canvas.height,
	grid: createWaypointGrid(GRID_SIZE),
	draw: drawGameBoard,
	enemies: [],
	apples: 0,
	init() {
		this.player = createPlayer(this)
		this.enemies.push(createEnemy(GRID_SIZE - 1, GRID_SIZE - 1, this))
		this.enemies.push(createEnemy(GRID_SIZE - 6, 0, this))

		this.waypoints = waypointSystem(this)
		// setup movement listeners
		setupMovement(this)

		// topleft
		spawnAppleAtBlock(this, 3, 3)
		spawnAppleAtBlock(this, 3, 6)
		spawnAppleAtBlock(this, 3, 9)
		spawnAppleAtBlock(this, 6, 3)
		spawnAppleAtBlock(this, 6, 6)
		spawnAppleAtBlock(this, 6, 9)
		// bottomleft
		spawnAppleAtBlock(this, 3, GRID_SIZE - 4)
		spawnAppleAtBlock(this, 3, GRID_SIZE - 7)
		spawnAppleAtBlock(this, 3, GRID_SIZE - 10)
		spawnAppleAtBlock(this, 6, GRID_SIZE - 4)
		spawnAppleAtBlock(this, 6, GRID_SIZE - 7)
		spawnAppleAtBlock(this, 6, GRID_SIZE - 10)
		// topright
		spawnAppleAtBlock(this, GRID_SIZE - 4, 3)
		spawnAppleAtBlock(this, GRID_SIZE - 4, 6)
		spawnAppleAtBlock(this, GRID_SIZE - 4, 9)
		spawnAppleAtBlock(this, GRID_SIZE - 7, 3)
		spawnAppleAtBlock(this, GRID_SIZE - 7, 6)
		spawnAppleAtBlock(this, GRID_SIZE - 7, 9)

		spawnAppleAtBlock(this, GRID_SIZE - 4, GRID_SIZE - 4)
		spawnAppleAtBlock(this, GRID_SIZE - 4, GRID_SIZE - 7)
		spawnAppleAtBlock(this, GRID_SIZE - 4, GRID_SIZE - 10)
		spawnAppleAtBlock(this, GRID_SIZE - 7, GRID_SIZE - 4)
		spawnAppleAtBlock(this, GRID_SIZE - 7, GRID_SIZE - 7)
		spawnAppleAtBlock(this, GRID_SIZE - 7, GRID_SIZE - 10)

		this.update.call(this)
	},
	// used for updating enitities
	lastUpdate: performance.now(),
	update(dt) {
		if (this.pause) return requestAnimationFrame(this.update.bind(this))
		let timePast = dt - this.lastUpdate
		while (timePast > GAME_STEP) {
			timePast -= GAME_STEP
			this.lastUpdate += GAME_STEP


			this.player.update()
			this.enemies.forEach(enemy => enemy.update())

			this.waypoints.update()
		}
		this.draw()

		requestAnimationFrame(this.update.bind(this))
	}
})


function spawnAppleAtBlock(gameBoard, X, Y) {
	const x = X || Math.round(Math.random() * gameBoard.grid.size) - 1
	const y = Y || Math.round(Math.random() * gameBoard.grid.size) - 1
	const node = gameBoard.grid.getGridNode(x, y)
	if (node.type === 'grass') node.type = 'apple'

	gameBoard.apples += 1
}

window.spawnAppleAtBlock = spawnAppleAtBlock
