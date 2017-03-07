import colors from './colors'
import { createPlayer as createPlayerNode } from './node'
import { 
	linkJunctionToNeighbours, 
	updateJunctionNeighbours, 
	createJunctionIfNotPresent, 
	checkNodeForJunctions,
	checkNodeForJunctions } from './junctions'


import { createJunction } from './node'
import { findPath } from './pathfinding'

const TERMINATE_MOVEMENT = {x:0,y:0}
// create enemy on gameBoard
export default (x, y, gameBoard) => {
	const enemy = {
		node: createJunction(x, y),
		pos: { x , y },
		vel: TERMINATE_MOVEMENT,
		wayPoints: [],
		updateNum: 0,
		prevJunctionCount: gameBoard.junctions.length,
		prevPlayerPos: gameBoard.player.pos.x + gameBoard.player.pos.y,
		lastUpdate: 0,
		getWayPointsToPlayer() { return this.wayPoints = getWayPointsToPlayer(this, gameBoard) || []},
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
		updatePos(pos) {
			pos.x += this.vel.x
			pos.y += this.vel.y
		},
		updateNode() {
			this.node.Left = this.node.Right = this.node.Up = this.node.Down = null

			createJunctionIfNotPresent(this.node.x, this.node.y, gameBoard, gameBoard.player)
			updateJunctionNeighbours(this.node, gameBoard, gameBoard.player)
			this.updatePos(this.node)
			updateJunctionNeighbours(this.node, gameBoard, this.node)

			checkNodeForJunctions(this.node, gameBoard, gameBoard.player.node)
				.map(junction => createJunctionIfNotPresent(junction.x, junction.y, gameBoard, this.node))
				.map(junction => updateJunctionNeighbours(junction, gameBoard, this.node))

			linkJunctionToNeighbours(this.node, gameBoard)
		},
		update() {
			// // if new junctions have been added recalculate path to player
			// const junctionCount = gameBoard.junctions.length
			// if (this.prevJunctionCount !== junctionCount) {
			// 	this.prevJunctionCount = junctionCount
			// 	this.getWayPointsToPlayer()
			// }
			// // if player has moved recalculate path
			// const newPlayerPos = gameBoard.player.pos.x + gameBoard.player.pos.y
			// if (newPlayerPos !== this.prevPlayerPos) {
			// 	this.prevPlayerPos = newPlayerPos
			// 	this.getWayPointsToPlayer()
			// }
			const newPlayerPos = gameBoard.player.pos.x + gameBoard.player.pos.y
			if (this.lastUpdate >= 5 && newPlayerPos !== this.prevPlayerPos) {
				this.prevPlayerPos = newPlayerPos
				this.lastUpdate = 0
				this.getWayPointsToPlayer()
			}
			

			this.updateNode()
			this.moveToNextWaypoint()
			this.updatePos(this.pos)
			this.lastUpdate += 1
		}
	}
	gameBoard.enemies.push(enemy)
	return enemy
}

function getWayPointsToPlayer(enemy, gameBoard) {
	const current = createJunctionIfNotPresent(enemy.pos.x, enemy.pos.y, gameBoard)
	
	return findPath(enemy.node, gameBoard.player.pos)
}