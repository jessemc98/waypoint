import colors from './colors'
import { findPath } from './pathfinding'

const TERMINATE_MOVEMENT = {x:0,y:0}
// create enemy on gameBoard
export default (x, y, gameBoard) => ({
	pos: { x , y },
	vel: TERMINATE_MOVEMENT,
	wayPoints: [],
	getWayPointsToPlayer() {
		const path = findPath(this.node, gameBoard.player.node) || []
		return this.wayPoints = path
	},
	moveToNextWaypoint() {
		// if que is empty, return, no waypoint to go to
		if (this.wayPoints.length < 1) return this.vel = TERMINATE_MOVEMENT

		const next = this.wayPoints[0].junction

		// if at next waypoint, remove from wayPoint que and make recursive call
		if (this.pos.x === next.x && this.pos.y === next.y) {
			this.wayPoints.shift()
			this.vel = TERMINATE_MOVEMENT

			return this.moveToNextWaypoint()
		}

		// default behaviour, set velocity so we eventually reach next waypoint
		const distX = this.pos.x - next.x
		const distY = this.pos.y - next.y

		this.vel = {
			x: distX === 0 ? 0 : distX < 0 ? 1 : -1,
			y: distY === 0 ? 0 : distY < 0 ? 1 : -1
		}
	},
	draw() {
		const { ctx } = gameBoard
		const { x, y } = this.pos
		const size = gameBoard.width / gameBoard.grid.size

		ctx.fillStyle = colors.apple
		ctx.fillRect(x * size + 5, y * size + 5, size - 10, size - 10)
	},
	update() {
		this.getWayPointsToPlayer()
		this.moveToNextWaypoint()

		this.pos.x += this.vel.x
		this.pos.y += this.vel.y
	}
})
