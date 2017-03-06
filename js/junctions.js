import { createJunction } from './node'


// creates a 'junction' node with pos of ('x', 'y')
// sets gridNode at pos ('x', 'y') to created 'junction'
// pushes 'junction' to this.junctions
export function createJunctionOnBoard (x, y, gameBoard) {
	const node = createJunction(x, y, 'junction')
	gameBoard.grid.setGridNode(x, y, node)
	gameBoard.junctions.push(node)

	return node
}

// if junction is not present creates junction and 
// calls linkJunctionToNeighbours on junction
export function createJunctionIfNotPresent(x, y, gameBoard) {
	let node = gameBoard.grid.getGridNode(x, y)
	if (node.type !== 'junction') {
		node = createJunctionOnBoard(x, y, gameBoard)
		linkJunctionToNeighbours(node, gameBoard)
	}

	return node
}

// creates a junction on board at given pos if it doesnt exist
// links junction on board at given pos to other junctions
export function createAndLinkJunctionToBoard(pos, gameBoard) {
	let node = createJunctionIfNotPresent(pos.x, pos.y, gameBoard)

	linkJunctionToNeighbours(node, gameBoard)

	return node
}

export function updateJunctionNeighbours(junction, gameBoard, player) {
	junction.Left && linkJunctionToNeighbours(junction.Left, gameBoard, player)
	junction.Right && linkJunctionToNeighbours(junction.Right, gameBoard, player)
	junction.Up && linkJunctionToNeighbours(junction.Up, gameBoard, player)
	junction.Down && linkJunctionToNeighbours(junction.Down, gameBoard, player)
}
// calls checkNodeForJunctions on given junction
// links returned junctions to given junction
export function linkJunctionToNeighbours(junction, gameBoard, player={x:-1,y:-1}) {
	const links = checkNodeForJunctions(junction, gameBoard, player)
	links.forEach(link => {
		const x = junction.x - link.x
		const y = junction.y - link.y
		if (link.x === player.x && link.y === player.y) return 
			
		const node = createJunctionIfNotPresent(link.x, link.y, gameBoard)

		if (x < 0) {
			junction.linkRight(node)
			return node.linkLeft(junction)
		}
		if (x > 0) {
			junction.linkLeft(node)
			return node.linkRight(junction)
		}
		if (y < 0) { 
			junction.linkDown(node)
			return node.linkUp(junction)
		}
		if (y > 0) { 
			junction.linkUp(node)
			return node.linkDown(junction)
		}

		linkJunctionToNeighbours(node, gameBoard, player)
	})
}
// returns array with vector objects with position of 
// junctions/where junctions should be placed around node
export function checkNodeForJunctions(node, { grid }, player={x: -1, y: -1}) {
	const getNodeAtPos = grid.getGridNode.bind(grid)
	const directions = [[-1,0], [1,0], [0,1], [0,-1]]

	return directions.reduce((junctions, dir) => {
		const junction = checkForJunctionInDirection(
			{x: node.x, y: node.y},
			{x: dir[0], y: dir[1]}, 
			getNodeAtPos,
			player)

		junction && junctions.push(junction)
		return junctions
	}, [])
}

// returns position of junction if there is a junction in given dir (direction)
// returns position where there should be a junction in given dir if there is no junction
// returns false if no junction and no need for a junction in given dir
export function checkForJunctionInDirection(pos, dir, getNodeAtPos, player, notInitial) {
	const nextPos = {
		x: pos.x + dir.x,
		y: pos.y + dir.y
	}
	const next = getNodeAtPos(nextPos.x, nextPos.y)

	// if on initial node and next is not walkable block, no junction
	if (!notInitial && !isWalkable(next)) return false

	// if not on initial node and next is grass, should be a junction return pos of node
	if (notInitial && !isWalkable(next)) return { x: pos.x, y: pos.y }

	// if next is junction return pos of that junction
	if (next.type === 'junction' || (next.x === player.x && next.y === player.y)) return { x: next.x, y: next.y }

	
	// if none of the above check next node recursively
	return checkForJunctionInDirection(
		{x: nextPos.x, y: nextPos.y}, 
		dir,
		getNodeAtPos, 
		player,
		true)
}

// return true if node is a block enemies can walk on
export function isWalkable(node) {
	if (!node) return false
	if (node.type === 'grass') return false
	return true
}