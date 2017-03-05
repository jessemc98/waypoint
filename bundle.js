/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = {
	grass: '#8bc34a',
	path: '#4caf50',
	apple: '#f44336',
	player: '#000000',
	junction: '#673ab7'
};

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["createNode"] = createNode;
/* harmony export (immutable) */ __webpack_exports__["createJunction"] = createJunction;
/* harmony export (immutable) */ __webpack_exports__["createPlayer"] = createPlayer;
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

const OPPOSITE = {
	Left: 'Right',
	Right: 'Left',
	Up: 'Down',
	Down: 'Up'
}
/* harmony export (immutable) */ __webpack_exports__["OPPOSITE"] = OPPOSITE;


const TYPES = {
	junction: 'junction',
	player: 'player'
}
/* harmony export (immutable) */ __webpack_exports__["TYPES"] = TYPES;


// creates a node
function createNode(x, y, type) {
	return new Node(x, y, type)
}

function createJunction(x, y) {
	return new JunctionNode(x, y, TYPES.junction)
}

function createPlayer(x, y) {
	return new JunctionNode(x, y, TYPES.player)
}

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gameboard__ = __webpack_require__(4);


const canvas = document.getElementById('game')
const game = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__gameboard__["default"])(canvas)
game.init()

window.game = game
// TODO create enemy
// TODO add enemy pathfinding using dvorska and implemented PathNode types




/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__colors__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["default"] = draw;


const drawGridOnGameBoard = gameBoard => {
	const { ctx, grid, width } = gameBoard
	const blockSize = width / grid.size

	gameBoard.grid.forEach((x, y, block) => {
		ctx.fillStyle = __WEBPACK_IMPORTED_MODULE_0__colors__["default"][block.type]
		ctx.fillRect(blockSize * x, blockSize * y, blockSize, blockSize)
	})
}

const fillGameBoard = (gameBoard, color) => {
	gameBoard.ctx.fillStyle = color
	gameBoard.ctx.fillRect(0, 0, gameBoard.width, gameBoard.height)
}

function draw() {
	drawGridOnGameBoard(this)
	this.player.draw()
}

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__grid__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__player__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__draw__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__playerinput__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__setupInitialMap__ = __webpack_require__(6);







/* harmony default export */ __webpack_exports__["default"] = (canvas) => ({
	canvas,
	ctx: canvas.getContext('2d'),
	width: canvas.width,
	height: canvas.height,
	grid: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__grid__["default"])(32),
	junctions: [],
	draw: __WEBPACK_IMPORTED_MODULE_2__draw__["default"],
	player: null,
	lastUpdate: performance.now(),
	init() {
		__WEBPACK_IMPORTED_MODULE_4__setupInitialMap__["default"].call(this)
		this.player = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__player__["default"])(this)
		
		// setup movement listeners
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3__playerinput__["setupMovement"])(this)

		this.update.call(this)
	},
	update(dt) {
		// update every 200 ms
		if (dt - this.lastUpdate < 200) return requestAnimationFrame(this.update.bind(this))
		this.lastUpdate = dt

		this.player.update()

		// set player block to path block if it is currently grass
		const { x, y } = this.player.pos
		const node = this.grid.getGridNode(x, y)
		node.type === 'grass' && (node.type = 'path')


		this.draw()

		requestAnimationFrame(this.update.bind(this))
	}
});


// const spawnAppleAtBlock = (gameBoard, index) => {
// 	const i = index || Math.round(Math.random() * Math.pow(gameBoard.grid.size, 2)) - 1
// 	gameBoard.grid.nodes[i] = 2
// 	gameBoard.apples += 1
// }


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["setupMovement"] = setupMovement;
function setupMovement(gameBoard) {
	document.addEventListener('keydown', e => {
		switch(e.key) {
			case('w'):
				return gameBoard.player.move('Up')
			case('d'):
				return gameBoard.player.move('Right')
			case('s'):
				return gameBoard.player.move('Down')
			case('a'):
				return gameBoard.player.move('Left')
		}
	})
	document.addEventListener('keyup', () => gameBoard.player.move())

	requestAnimationFrame(gameBoard.update.bind(gameBoard))
}

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node__ = __webpack_require__(1);
/* harmony export (immutable) */ __webpack_exports__["default"] = setupInitialPaths;


// setup the initial paths and waypoints
function setupInitialPaths() {
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
		const node = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__node__["createJunction"])(x, y, 'junction')
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

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = (size) => ({
	size,
	nodes: Array(size * size).fill(0).map(_ => ({type: 'grass'})),
	getGridNode(x, y) {
		if (x < 0 || x >= size || y < 0 || y >= size) return null
		return this.nodes[x + y * this.size]
	},
	setGridNode(x, y, value) {
		if (x < 0 || x >= size || y < 0 || y >= size) return null
		const index = x + y * this.size

		this.nodes[index] = value
	},
	forEach(fn) {
		for(let column = size - 1; column >= 0; column -= 1){
			for(let row = size - 1; row >= 0; row -= 1){
				fn(row, column, this.nodes[row + column * this.size])
			}
		}
	}
});

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__colors__ = __webpack_require__(0);



// create player
/* harmony default export */ __webpack_exports__["default"] = (gameBoard) => {
	const getGridNode = gameBoard.grid.getGridNode.bind(gameBoard.grid)
	const setGridNode = gameBoard.grid.setGridNode.bind(gameBoard.grid)
	const initialPos = {
		x: 0,
		y: gameBoard.grid.size / 2 - 1
	}
	const node = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__node__["createPlayer"])(0, gameBoard.grid.size / 2 - 1)
	node.linkUp(getGridNode(0, 0))
	node.linkDown(getGridNode(0,31))
	

	const updateNode = function () {
		const current = this.getCurrentNode()
		const next = this.getNextNode()

		// if moving from junction to junction, do nothing
		// if(current.type === 'junction' && next.type === 'junction') return

		// if moving from junction to path
		if(current.type === 'junction' && next.type === 'path') {
			const opposite = true
			console.log(this)
			this.node.clearLinks()

			current[this.dir].link(this.dir, this.node, opposite)
			current.link(this.dir, node)
		}
		// if moving from path to grass
		if(current.type === 'path' &&
			next.type === 'grass') {
		//TODO if moving from path to grass but in same axis as previous step do nothing
			let copy = Object.assign(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__node__["createPlayer"])(), this.node)
			this.node.type = 'junction'

			setGridNode(this.pos.x, this.pos.y, this.node)
			this.node = copy
		}
		// move player node
		this.node.x += this.vel.x
		this.node.y += this.vel.y
	}
	return {
		node,
		pos: initialPos,
		vel: { x: 0, y: 0 },
		getCurrentNode() {
			return getGridNode(this.pos.x, this.pos.y)
		},
		getNextNode() {
			return getGridNode(this.pos.x + this.vel.x, this.pos.y + this.vel.y)
		},
		move(dir) {
			this.dir = dir
			// if no direction stop moving
			if (!dir) {
				return this.vel.x = this.vel.y = 0 }

			this['move' + dir]()
		},
		moveUp() {
			return this.pos.y !== 0 && (this.vel.y = -1)
		},
		moveRight() {
			return this.pos.x !== gameBoard.grid.size - 1 && (this.vel.x = 1)
		},
		moveDown() {
			return this.pos.y !== gameBoard.grid.size - 1 && (this.vel.y = 1)
		},
		moveLeft() {
			return this.pos.x !== 0 && (this.vel.x = -1)
		},
		update() {
			updateNode.call(this)
			this.pos.x += this.vel.x
			this.pos.y += this.vel.y
		},
		draw() {
			const { ctx } = gameBoard
			const { x, y } = this.pos
			const size = gameBoard.width / gameBoard.grid.size

			ctx.fillStyle = __WEBPACK_IMPORTED_MODULE_1__colors__["default"][this.node.type]
			ctx.fillRect(x * size + 5, y * size + 5, size - 10, size - 10)
		}
	}
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2);
__webpack_require__(0);
__webpack_require__(7);
__webpack_require__(2);
__webpack_require__(1);
__webpack_require__(8);
__webpack_require__(3);
__webpack_require__(4);
__webpack_require__(5);
module.exports = __webpack_require__(6);


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map