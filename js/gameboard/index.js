import createPlayer from '../player'
import createEnemy from '../enemy'

import { GAME_STEP, GRID_SIZE, NODE_TYPES } from '../constants'
import drawGameBoard from './draw'
import { setupMovement } from './playerinput'
import waypointSystem, { createWaypointGrid } from './junctionWaypoints'
import ui from './interface'

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
		// setup ui
		this.ui = ui(this)

		// setup player
		this.player = createPlayer(this)
		// setup keyboard listeners
		setupMovement(this)

		// make some enemies
		this.enemies.push(createEnemy(GRID_SIZE - 1, GRID_SIZE - 1, this))
		this.enemies.push(createEnemy(GRID_SIZE - 6, 0, this))
		this.enemies.push(createEnemy(GRID_SIZE - 1, GRID_SIZE / 2, this))

		// setup grid/waypoint system
		this.waypoints = waypointSystem(this)

		// make some apples
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
		// topleft
		spawnAppleAtBlock(this, GRID_SIZE - 4, GRID_SIZE - 4)
		spawnAppleAtBlock(this, GRID_SIZE - 4, GRID_SIZE - 7)
		spawnAppleAtBlock(this, GRID_SIZE - 4, GRID_SIZE - 10)
		spawnAppleAtBlock(this, GRID_SIZE - 7, GRID_SIZE - 4)
		spawnAppleAtBlock(this, GRID_SIZE - 7, GRID_SIZE - 7)
		spawnAppleAtBlock(this, GRID_SIZE - 7, GRID_SIZE - 10)

		// draw initial state
		this.draw()
		this.update.call(this)
	},
	// GAME LOOP
	lastUpdate: null,
	pause: true,
	update(dt) {
		if (this.pause) return requestAnimationFrame(this.update.bind(this))
		let timePast = dt - this.lastUpdate
		while (timePast > GAME_STEP) {
			timePast -= GAME_STEP
			this.lastUpdate += GAME_STEP

			// update entity positions
			this.player.update()
			this.enemies.forEach(enemy => enemy.update())

			this.waypoints.update()
		}
		this.draw()

		requestAnimationFrame(this.update.bind(this))
	}
})

function spawnAppleAtBlock(gameBoard, X, Y) {
	const x = X || Math.round(Math.random() * GRID_SIZE) - 1
	const y = Y || Math.round(Math.random() * GRID_SIZE) - 1
	const node = gameBoard.grid.getGridNode(x, y)
	if (node.type === NODE_TYPES.grass) {
		node.type = NODE_TYPES.apple

		gameBoard.apples += 1
	}
}
