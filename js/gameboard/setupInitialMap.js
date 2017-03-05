import { createJunction } from '../node'

// setup the initial paths and waypoints
export default function setupInitialPaths() {
	const { size } = this.grid
	const setGridNode = this.grid.setGridNode.bind(this.grid)

	// draw paths around edges and line in the center
	for(let block = size - 1; block >= 0; block -= 1) {
		// left
		setGridNode(0, block, {type: 'path'})
		// right
		setGridNode(size - 1, block, {type: 'path'})
		// top
		setGridNode(block, 0, {type: 'path'})
		// bottom
		setGridNode(block, size - 1, {type: 'path'})
		// center
		setGridNode(size / 2 - 1, block, {type: 'path'})
	}

	// creates a 'junction' node with pos of ('x', 'y')
	// sets gridNode at pos ('x', 'y') to created 'junction'
	// pushes 'junction' to this.junctions
	const createJunctionNode = (x, y) => {
		const node = createJunction(x, y, 'junction')
		setGridNode(x, y, node)
		this.junctions.push(node)
		return node
	}
	// set junction nodes for each junction
	const topLeft = createJunctionNode(0, 0)
	const topMid = createJunctionNode(size/2 - 1, 0)
	const topRight = createJunctionNode(size - 1, 0)
	const bottomLeft = createJunctionNode(0, size - 1)
	const bottomMid = createJunctionNode(size/2 - 1, size - 1)
	const bottomRight = createJunctionNode(size - 1, size - 1)

	// create links between junctions
	topLeft.linkRight(topMid)
	topLeft.linkDown(bottomLeft)
	topMid.linkRight(topRight)
	topMid.linkDown(bottomMid)
	topRight.linkDown(bottomRight)
	bottomLeft.linkRight(bottomMid)
	bottomMid.linkRight(bottomRight)
}