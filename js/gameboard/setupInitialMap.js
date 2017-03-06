import { createJunction } from '../node'
import { createJunctionOnBoard, linkJunctionToNeighbours } from '../waypoints'

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

	const initialJunctions = [
		[0,0], 
		[size/2 - 1, 0], 
		[size - 1, 0], 
		[0, size - 1], 
		[size/2 - 1, size - 1], 
		[size - 1, size - 1]]
		.map(pos => createJunctionOnBoard(pos[0], pos[1], this))
		.map(node => linkJunctionToNeighbours(node, this))
}