import colors from '../colors'

const drawGridOnGameBoard = gameBoard => {
	const { ctx, grid, width } = gameBoard
	const blockSize = width / grid.size

	gameBoard.grid.forEach((x, y, block) => {
		ctx.fillStyle = colors[block.type]
		ctx.fillRect(blockSize * x, blockSize * y, blockSize, blockSize)
	})
}

const fillGameBoard = (gameBoard, color) => {
	gameBoard.ctx.fillStyle = color
	gameBoard.ctx.fillRect(0, 0, gameBoard.width, gameBoard.height)
}

export default function draw() {
	drawGridOnGameBoard(this)
	this.player.draw()
}