class Node {
	constructor(x, y, type) {
		this.x = x
		this.y = y
		this.type = type
	}

	// returns array with position of junctions/where junctions should be placed around node
	checkForNodes(getNodeAtPos) {
		return [[-1,0], [1,0], [0,1], [0,-1]].reduce((nodes, xY) => {
			const node = this.checkForJunctionInDirection(
				{x: this.x, y: this.y},
				{x: xY[0], y: xY[1]}, 
				getNodeAtPos)

			node && nodes.push(node)
			return nodes
		}, [])
	}
	checkForJunctionInDirection(pos, dir, getNodeAtPos, notInitial) {
		const nextPos = {
			x: pos.x + dir.x,
			y: pos.y + dir.y
		}
		const next = getNodeAtPos(nextPos.x, nextPos.y)

		// if on initial node and next is not walkable block, no junction
		if (!notInitial && !this.isWalkable(next)) return false

		// if not on initial node and next is grass, should be a junction
		if (notInitial && !this.isWalkable(next)) return { x: this.x, y: this.y }

		// if next is junction return that junction
		if (next.type === 'junction') return { x: next.x, y: next.y }

		

		// if none of the above check next node recursively
		return this.checkForJunctionInDirection(
			{x: nextPos.x, y: nextPos.y}, 
			dir,
			getNodeAtPos, 
			true)
	}
	isWalkable(node) {
		if (!node) return false
		if (node.type === 'grass') return false
		return true
	}
}

class JunctionNode extends Node {

	link(dir, node, shouldOpposite) {
		if (!node) {
			this[dir][OPPOSITE[dir]] = null
			return this[dir] = null
		}
		const direction = shouldOpposite ? OPPOSITE[dir] : dir
		const opposite = shouldOpposite ? dir : OPPOSITE[dir]
		this[direction] = node
		this[direction][opposite] = this
	}

	linkLeft(node) {
		this.link('Left', node)
	}

	linkRight(node) {
		this.link('Right', node)
	}

	linkDown(node) {
		this.link('Down', node)
	}

	linkUp(node) {
		this.link('Up', node)
	}

	clearLinks() {
		this.Left && this.Left.linkRight(this.Right)
		this.Right && this.Right.linkLeft(this.Left)
		this.Up && this.Up.linkDown(this.Down)
		this.Down && this.Down.linkUp(this.Up)

		this.Left = this.Right = this.Up = this.Down = null
	}
}

export const OPPOSITE = {
	Left: 'Right',
	Right: 'Left',
	Up: 'Down',
	Down: 'Up'
}

export const TYPES = {
	junction: 'junction',
	player: 'player'
}

// creates a node
export function createNode(x, y, type) {
	return new Node(x, y, type)
}

export function createJunction(x, y) {
	return new JunctionNode(x, y, TYPES.junction)
}

export function createPlayer(x, y) {
	return new JunctionNode(x, y, TYPES.player)
}