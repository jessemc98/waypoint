export default (size, filler={type: 'grass'}) => ({
	size,
	nodes: Array(size * size).fill(0).map(_ => Object.assign({},filler)),

	getGridNode(x, y) {
		if (x < 0 || x >= size || y < 0 || y >= size) return null
		return this.nodes[x + y * this.size]
	},
	setGridNode(x, y, value) {
		if (x < 0 || x >= size || y < 0 || y >= size) return null
		const index = x + y * this.size

		return this.nodes[index] = value
	},
	forEach(fn) {
		for(let column = size - 1; column >= 0; column -= 1){
			for(let row = size - 1; row >= 0; row -= 1){
				fn(row, column, this.nodes[row + column * this.size])
			}
		}
	}
})
