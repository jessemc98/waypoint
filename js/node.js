class Node {
	constructor(x, y, type) {
		this.x = x
		this.y = y
		this.type = type
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