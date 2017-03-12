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
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
const GRID_SIZE = 16
/* harmony export (immutable) */ __webpack_exports__["GRID_SIZE"] = GRID_SIZE;

const GAME_STEP = (1000/60) * 12
/* harmony export (immutable) */ __webpack_exports__["GAME_STEP"] = GAME_STEP;


const TERMINATE_MOVEMENT = { x:0, y:0 }
/* harmony export (immutable) */ __webpack_exports__["TERMINATE_MOVEMENT"] = TERMINATE_MOVEMENT;

const OPPOSITES = {
	Left: 'Right',
	Right: 'Left',
	Up: 'Down',
	Down: 'Up'
}
/* harmony export (immutable) */ __webpack_exports__["OPPOSITES"] = OPPOSITES;


const NODE_TYPES = {
  apple: 'APPLE',
  // junction nodes
	junction: 'JUNCTION',
	player: 'PLAYER',
	enemy: 'ENEMY',
  // used for waypoint making and styling
  path: 'PATH',
  grass: 'GRASS'
}
/* harmony export (immutable) */ __webpack_exports__["NODE_TYPES"] = NODE_TYPES;


// nodes which enemies cant step on
const SOLID_NODES = ['GRASS', 'APPLE']
/* harmony export (immutable) */ __webpack_exports__["SOLID_NODES"] = SOLID_NODES;


const INITIAL_PLAYER_POS = {
  x: 0,
  y: GRID_SIZE / 2 -1
}
/* harmony export (immutable) */ __webpack_exports__["INITIAL_PLAYER_POS"] = INITIAL_PLAYER_POS;



/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony default export */ __webpack_exports__["default"] = {
	GRASS: '#8bc34a',
	PATH: '#459e49',
	ENEMY: '#000000',
	APPLE: '#a41b11',
	PLAYER: '#ffffff',
	JUNCTION: '#459e49'//'#673ab7'
};


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gameboard__ = __webpack_require__(5);


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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__colors__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__pathfinding__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constants__ = __webpack_require__(0);




// create enemy on gameBoard
/* harmony default export */ __webpack_exports__["default"] = (x, y, gameBoard) => ({
	pos: { x , y },
	vel: Object.assign({}, __WEBPACK_IMPORTED_MODULE_2__constants__["TERMINATE_MOVEMENT"]),
	wayPoints: [],
	getWayPointsToPlayer() {
		return this.wayPoints = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__pathfinding__["findPath"])(this.node, gameBoard.player.node)
	},
	moveToNextWaypoint() {
		// if que is empty, return, no waypoint to go to
		if (this.wayPoints.length < 1) return this.vel = __WEBPACK_IMPORTED_MODULE_2__constants__["TERMINATE_MOVEMENT"]

		const next = this.wayPoints[0].junction

		// if at next waypoint, remove from wayPoint que and make recursive call
		if (this.pos.x === next.x && this.pos.y === next.y) {
			this.wayPoints.shift()
			this.vel = __WEBPACK_IMPORTED_MODULE_2__constants__["TERMINATE_MOVEMENT"]

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

		ctx.fillStyle = __WEBPACK_IMPORTED_MODULE_0__colors__["default"].ENEMY
		ctx.fillRect(x * size + 5, y * size + 5, size - 10, size - 10)
	},
	update() {
		this.moveToNextWaypoint()

		this.pos.x += this.vel.x
		this.pos.y += this.vel.y
	}
});


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__colors__ = __webpack_require__(1);
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
	this.enemies.forEach(enemy => enemy.draw())
}

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__player__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__enemy__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constants__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__draw__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__playerinput__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__junctionWaypoints__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__interface__ = __webpack_require__(13);









/* harmony default export */ __webpack_exports__["default"] = (canvas) => ({
	canvas,
	ctx: canvas.getContext('2d'),
	width: canvas.width,
	height: canvas.height,
	grid: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__junctionWaypoints__["createWaypointGrid"])(__WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"]),
	draw: __WEBPACK_IMPORTED_MODULE_3__draw__["default"],
	enemies: [],
	apples: 0,
	init() {
		// setup ui
		this.ui = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__interface__["a" /* default */])(this)

		// setup player
		this.player = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__player__["default"])(this)
		// setup keyboard listeners
		__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4__playerinput__["setupMovement"])(this)

		// make some enemies
		this.enemies.push(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__enemy__["default"])(__WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 1, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 1, this))
		this.enemies.push(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__enemy__["default"])(__WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 6, 0, this))
		this.enemies.push(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__enemy__["default"])(__WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 1, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] / 2, this))

		// setup grid/waypoint system
		this.waypoints = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5__junctionWaypoints__["default"])(this)

		// make some apples
		// topleft
		spawnAppleAtBlock(this, 3, 3)
		spawnAppleAtBlock(this, 3, 6)
		spawnAppleAtBlock(this, 3, 9)
		spawnAppleAtBlock(this, 6, 3)
		spawnAppleAtBlock(this, 6, 6)
		spawnAppleAtBlock(this, 6, 9)
		// bottomleft
		spawnAppleAtBlock(this, 3, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 4)
		spawnAppleAtBlock(this, 3, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 7)
		spawnAppleAtBlock(this, 3, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 10)
		spawnAppleAtBlock(this, 6, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 4)
		spawnAppleAtBlock(this, 6, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 7)
		spawnAppleAtBlock(this, 6, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 10)
		// topright
		spawnAppleAtBlock(this, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 4, 3)
		spawnAppleAtBlock(this, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 4, 6)
		spawnAppleAtBlock(this, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 4, 9)
		spawnAppleAtBlock(this, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 7, 3)
		spawnAppleAtBlock(this, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 7, 6)
		spawnAppleAtBlock(this, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 7, 9)
		// topleft
		spawnAppleAtBlock(this, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 4, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 4)
		spawnAppleAtBlock(this, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 4, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 7)
		spawnAppleAtBlock(this, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 4, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 10)
		spawnAppleAtBlock(this, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 7, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 4)
		spawnAppleAtBlock(this, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 7, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 7)
		spawnAppleAtBlock(this, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 7, __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"] - 10)

		// draw initial state
		this.draw()
		this.update.call(this)
	},
	// GAME LOOP
	lastUpdate: null,
	pause: true,
	update(dt) {
		if (this.pause) return requestAnimationFrame(this.update.bind(this))
		let timePast = dt - this.lastUpdate
		while (timePast > __WEBPACK_IMPORTED_MODULE_2__constants__["GAME_STEP"]) {
			timePast -= __WEBPACK_IMPORTED_MODULE_2__constants__["GAME_STEP"]
			this.lastUpdate += __WEBPACK_IMPORTED_MODULE_2__constants__["GAME_STEP"]

			// update entity positions
			this.player.update()
			this.enemies.forEach(enemy => enemy.update())

			this.waypoints.update()
		}
		this.draw()

		requestAnimationFrame(this.update.bind(this))
	}
});

function spawnAppleAtBlock(gameBoard, X, Y) {
	const x = X || Math.round(Math.random() * __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"]) - 1
	const y = Y || Math.round(Math.random() * __WEBPACK_IMPORTED_MODULE_2__constants__["GRID_SIZE"]) - 1
	const node = gameBoard.grid.getGridNode(x, y)
	if (node.type === __WEBPACK_IMPORTED_MODULE_2__constants__["NODE_TYPES"].grass) {
		node.type = __WEBPACK_IMPORTED_MODULE_2__constants__["NODE_TYPES"].apple

		gameBoard.apples += 1
	}
}


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__node_js__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__grid_js__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constants__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["default"] = waypointSystem;
/* harmony export (immutable) */ __webpack_exports__["createWaypointGrid"] = createWaypointGrid;



const ABS = Math.abs

function waypointSystem(gameBoard) {
  const { player, enemies, grid } = gameBoard
  const walkSound = new Audio('./walk.mp3')
  const appleSound = new Audio('./apple.mp3')
  const deathSound = new Audio('./enemy.mp3')

  player.node = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__node_js__["createPlayer"])(player.pos.x, player.pos.y)

  enemies.map(enemy =>
    enemy.node = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__node_js__["createEnemy"])(enemy.pos.x, enemy.pos.y))

  let prevWayPoints = {
    Left: player.node.Left,
    Right: player.node.Right,
    Up: player.node.Up,
    Down: player.node.Down
  }
  return {
    update() {
      const prevConnections = getJunctionNeighbours(player.node)
      // if player has moved update player junction node
      if (!(player.pos.x === player.node.x && player.pos.y === player.node.y)) {
        walkSound.currentTime = 0
        walkSound.play()

        player.node.clearLinks()
        updatePos(player.node, player.pos)

        linkJunctionToNeighbours(player.node, grid)

        const nodeAtPlayer = grid.getGridNode(player.node.x, player.node.y)
        // turn grass to path if player is on grass node
        if (nodeAtPlayer.type === __WEBPACK_IMPORTED_MODULE_2__constants__["NODE_TYPES"].grass) nodeAtPlayer.type = __WEBPACK_IMPORTED_MODULE_2__constants__["NODE_TYPES"].path
        // eat apple if player is on apple node
        if (nodeAtPlayer.type === __WEBPACK_IMPORTED_MODULE_2__constants__["NODE_TYPES"].apple) {
          appleSound.currentTime = 0
          appleSound.play()
          nodeAtPlayer.type = __WEBPACK_IMPORTED_MODULE_2__constants__["NODE_TYPES"].path
          gameBoard.apples -= 1
        }
        // check if player has collected all apples
        if (gameBoard.apples === 0 ) {
          gameBoard.apples -= 1
          gameBoard.ui.win()
        }

        prevConnections.forEach(connection => linkJunctionToNeighbours(connection, grid, player.node))
      }

      // update enemy junction nodes
      enemies.forEach((enemy, i) => {
        const prevConnections = getJunctionNeighbours(enemy.node)
        enemy.node.clearLinks()

        updatePos(enemy.node, enemy.pos)
        linkJunctionToNeighbours(enemy.node, grid)

        prevConnections.forEach(connection => linkJunctionToNeighbours(connection, grid, player.node))
      })
      // check if enemies have caught player
      enemies.forEach(enemy => {
        if (enemy.pos.x === player.pos.x && enemy.pos.y === player.pos.y) {
          deathSound.currentTime = 0
          deathSound.play()
          return gameBoard.ui.gameOver()
        }
      })

      // if player connections have changed recalculate enemy paths
      if (
        prevWayPoints.Left !== player.node.Left ||
        prevWayPoints.Right !== player.node.Right ||
        prevWayPoints.Up !== player.node.Up ||
        prevWayPoints.Down !== player.node.Down ) {
        enemies.forEach(enemy => enemy.getWayPointsToPlayer())
      }
      prevWayPoints = {
        Left: player.node.Left,
        Right: player.node.Right,
        Up: player.node.Up,
        Down: player.node.Down
      }
    }
  }
}

// expects size to be an INT
// expects initialWaypoints to be an array with vector objects
// returns Grid with waypoints added to the grid and paths created between them
function createWaypointGrid(size) {
  const waypointGrid = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__grid_js__["default"])(size)
  const initialWaypoints = [
    {x: 0, y: 0},
    {x: size - 1, y: 0},
    {x: 0, y: size - 1},
    {x: size - 1, y: size - 1}
  ]
  // draw paths around edges
  drawPathBetweenJunctions([initialWaypoints[0], initialWaypoints[1]], waypointGrid)
  drawPathBetweenJunctions([initialWaypoints[0], initialWaypoints[2]], waypointGrid)
  drawPathBetweenJunctions([initialWaypoints[2], initialWaypoints[3]], waypointGrid)
  drawPathBetweenJunctions([initialWaypoints[1], initialWaypoints[3]], waypointGrid)
  // set initial waypoints on grid and link to each other
  initialWaypoints
    .map(waypoint => __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__node_js__["createJunction"])(waypoint.x, waypoint.y))
    .map(junction => waypointGrid.setGridNode(junction.x, junction.y, junction))
    .map(junction => linkJunctionToNeighbours(junction, waypointGrid))

  return waypointGrid
}

// expects:
//   an array of exactly 2, currently linked, Junction nodes.
//   a Grid object
// sets every node between junctions to be of type NODE_TYPES.path if it is not of type 'junction'
function drawPathBetweenJunctions(junctions, grid) {
  const path = getPathBetweenJunctions(junctions[0], junctions[1])
    for (let next = path.next(); next = path.next();) {

      if (!next) return
      const gridNode = grid.getGridNode(next.x, next.y)

      // set node type to path if not a junction
      if (gridNode.type !== __WEBPACK_IMPORTED_MODULE_2__constants__["NODE_TYPES"].junction) gridNode.type = __WEBPACK_IMPORTED_MODULE_2__constants__["NODE_TYPES"].path
    }
}

// expects: a and b to be two linked nodes
// returns array of vector objects starting at pos a ending at pos b
function getPathBetweenJunctions(a, b) {
  const distAndDir = getDisanceAndDirection(a, b)

  let currentPos = Object.assign({}, a)
  let distance = Math.max(distAndDir.distance.x, distAndDir.distance.y)
  // for each node between first junction and second junction
  const path = []
  for(distance; distance > 0; distance -= 1) {
    path.push(Object.assign({},currentPos))
    currentPos.x += distAndDir.direction.x
    currentPos.y += distAndDir.direction.y
  }
  return {
    path,
    next() {
      if (path[0]) return this.path.splice(0, 1)[0]

      return null
    }
  }
}
window.distance = getDisanceAndDirection
function getDisanceAndDirection(current, target) {
  const distance = {
    x: target.x - current.x,
    y: target.y - current.y
  }
  // turn into direction vector, normalize or w/e you call it in math mumbo jumbo
  const direction = {
    x: distance.x == 0 ? 0 : (1 / distance.x) * ABS(distance.x + distance.y),
    y: distance.y == 0 ? 0 : (1 / distance.y) * ABS(distance.x + distance.y)
  }
  return { distance, direction }
}

// returns junctions already linked to given junction
function getJunctionNeighbours(junction) {
  return (['Right', 'Left', 'Up', 'Down']
    .reduce((total, direction) => {
      const link = junction[direction]
      link && total.push(link)
      return total
    }, []))
}

// if player is defined will treat player as a possible waypoint
function linkJunctionToNeighbours(junction, grid, player) {
  // console.log('linking', Object.assign({}, junction), 'to');
  const neighbours = checkJunctionForNeighbours(junction, grid, player)
  neighbours
    .map(neighbour => neighbour === player ?
      player:
      grid.getGridNode(neighbour.x, neighbour.y))
    // set neighbour to junction if not already a junction
    .map(neighbour => {
      // console.log('neighbour', Object.assign({}, neighbour));
      if (!(neighbour.type === __WEBPACK_IMPORTED_MODULE_2__constants__["NODE_TYPES"].junction || neighbour.type === __WEBPACK_IMPORTED_MODULE_2__constants__["NODE_TYPES"].player)) {

        neighbour = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__node_js__["createJunction"])(neighbour.x, neighbour.y)
        // console.log('created junction', Object.assign({}, neighbour));
        // console.log('calling link junc to neighbour recursively');
        linkJunctionToNeighbours(neighbour, grid, player)

        return grid.setGridNode(neighbour.x, neighbour.y, neighbour)
      }
      return neighbour
    })
    .map(neighbourNode => linkGivenJunctions(junction, neighbourNode))
    // console.log('end link');
  return junction
}

// links two junctions
function linkGivenJunctions(a, b) {
  const dir = vectorToDirection(
    getDisanceAndDirection(a, b).direction)

  return a.link(dir, b)
}

function vectorToDirection(xY) {
  const directions = {
    '1': {'0': 'Right'},
    '-1': {'0': 'Left'},
    '0': {
      '1': 'Down',
      '-1': 'Up'
    }
  }
  return directions[xY.x][xY.y]
}

function checkJunctionForNeighbours(junction, grid, player={x:-1,y:-1}) {
  const directions = [[-1,0], [1,0], [0,1], [0,-1]]
  return (
    directions.reduce((neighbours, direction) => {
      const tracer = createTracer(junction, {x: direction[0], y: direction[1]}, grid)

      let next

      tracer.next((prevNode, currNode, i) => next = {prevNode, currNode, i})

      while (next.currNode) {

        if (next.currNode.x === player.x && next.currNode.y === player.y) {
          neighbours.push(player)
          return neighbours
        }
        if (next.currNode.type === __WEBPACK_IMPORTED_MODULE_2__constants__["NODE_TYPES"].junction) {
          neighbours.push(next.currNode)
          return neighbours
        }
        if (next.currNode.type === __WEBPACK_IMPORTED_MODULE_2__constants__["NODE_TYPES"].grass || next.currNode.type === __WEBPACK_IMPORTED_MODULE_2__constants__["NODE_TYPES"].apple) {
          if (next.i === 0) return neighbours
          neighbours.push(next.prevNode)
          return neighbours
        }
        tracer.next((prevNode, currNode, i) => next = {prevNode, currNode, i})
      }
      if (next.i === 0) return neighbours
      neighbours.push(next.prevNode)
      return neighbours
    }, []))
}

function createTracer(start, direction, grid) {
  let iteration = 0
  let currentPos = Object.assign({}, start)
  let prevNode;
  return {
    next(fn) {
      const current = {
        x: currentPos.x += direction.x,
        y: currentPos.y += direction.y
      }

      const node = grid.getGridNode(current.x, current.y)
      if (node) Object.assign(node, current)

      fn(prevNode, node, iteration)
      prevNode = node
      iteration += 1
    }
  }
}

function updatePos(a, b) {
  a.x = b.x
  a.y = b.y
}


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["setupMovement"] = setupMovement;
function setupMovement(gameBoard) {
	const state = []
	document.addEventListener('keydown', e => {
		if (e.key === 'w' || e.key === 'a' || e.key === 's' || e.key === 'd') {
			if (state.indexOf(e.key) === -1) {
				state.unshift(e.key)
			}
		}

		movePlayer(state[0], gameBoard.player)
	})
	document.addEventListener('keyup', e => {
		const i = state.indexOf(e.key)
		if (i > -1) {
			state.splice(i, 1)
		}
		movePlayer(state[0], gameBoard.player)
	})
}

function movePlayer(dir, player) {
	switch(dir) {
		case('w'):
			return player.move('Up')
		case('d'):
			return player.move('Right')
		case('s'):
			return player.move('Down')
		case('a'):
			return player.move('Left')
		default:
			return player.move()
	}
}


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(0);

/* harmony default export */ __webpack_exports__["default"] = (size, filler={type: __WEBPACK_IMPORTED_MODULE_0__constants__["NODE_TYPES"].grass}) => ({
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
});


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(0);
/* harmony export (immutable) */ __webpack_exports__["createNode"] = createNode;
/* harmony export (immutable) */ __webpack_exports__["createJunction"] = createJunction;
/* harmony export (immutable) */ __webpack_exports__["createPlayer"] = createPlayer;
/* harmony export (immutable) */ __webpack_exports__["createEnemy"] = createEnemy;


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
			this[dir][__WEBPACK_IMPORTED_MODULE_0__constants__["OPPOSITES"][dir]] = null
			return this[dir] = null
		}
		const direction = shouldOpposite ? __WEBPACK_IMPORTED_MODULE_0__constants__["OPPOSITES"][dir] : dir
		const opposite = shouldOpposite ? dir : __WEBPACK_IMPORTED_MODULE_0__constants__["OPPOSITES"][dir]
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

function createNode(x, y, type) {
	return new Node(x, y, type)
}

function createJunction(x, y) {
	return new JunctionNode(x, y, __WEBPACK_IMPORTED_MODULE_0__constants__["NODE_TYPES"].junction)
}

function createPlayer(x, y) {
	return new JunctionNode(x, y, __WEBPACK_IMPORTED_MODULE_0__constants__["NODE_TYPES"].player)
}

function createEnemy(x, y) {
	return new JunctionNode(x, y, __WEBPACK_IMPORTED_MODULE_0__constants__["NODE_TYPES"].enemy)
}


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["createInitialWayPoint"] = createInitialWayPoint;
/* harmony export (immutable) */ __webpack_exports__["getWaypointJunctionNodes"] = getWaypointJunctionNodes;
/* harmony export (immutable) */ __webpack_exports__["findPath"] = findPath;
/* harmony export (immutable) */ __webpack_exports__["findJunction"] = findJunction;
/* harmony export (immutable) */ __webpack_exports__["getNextNodeIndex"] = getNextNodeIndex;
/* harmony export (immutable) */ __webpack_exports__["getEuclideanDistance"] = getEuclideanDistance;
/* harmony export (immutable) */ __webpack_exports__["getWaypointJunctions"] = getWaypointJunctions;
/* harmony export (immutable) */ __webpack_exports__["tracePath"] = tracePath;
const ABS = Math.abs

function createInitialWayPoint(initial, target) {
	return {
		junction: initial,
		h: getEuclideanDistance(initial, target),
		g: 0
	}
}

function getWaypointJunctionNodes(wayPoint, target) {
	return getWaypointJunctions(wayPoint)
		.map( junction => {
			const h = getEuclideanDistance(junction, target)
			const g = getEuclideanDistance(junction, wayPoint.junction) + (wayPoint.parent? wayPoint.parent.g : 0)
			return {
				junction,
				h,
				g,
				f: g + h,
				parent: wayPoint
			}
		})
}
window.findPath = findPath
function findPath(current, target) {
	const initialWaypoint = createInitialWayPoint(current, target)
	const openList = getWaypointJunctionNodes(initialWaypoint, target)
	const closedList = [initialWaypoint]

	while (openList.length > 0) {
		const currentIndex = getNextNodeIndex(openList)
		const current = openList.splice(currentIndex, 1)[0]

		// if at target pos return path
		if (current.junction.x === target.x && current.junction.y === target.y)
			return tracePath(current)

		closedList.push(current)

		const neighbours = getWaypointJunctions(current)
		neighbours.forEach(neighbour => {
			// if in closed list, already checked
			if (closedList.find(findJunction(neighbour))) return

			const newG = getEuclideanDistance(current.junction, neighbour) + (current.parent? current.parent.g : 0)
			const newH = getEuclideanDistance(neighbour, target)
			const newWaypoint = {
				junction: neighbour,
				parent: current,
				h: newH,
				g: newG,
				f: newG + newH
			}
			const wayPointInOpenList = openList.find(findJunction(neighbour))
			// if not in openList, discovered a new node 
			if (!wayPointInOpenList) return openList.push(newWaypoint)

			// if greater g value, is further away
			if (wayPointInOpenList.g < newWaypoint.g) return

			// new path is better than old, record it
			Object.assign(wayPointInOpenList, newWaypoint)
		})
	}
}
function findJunction(junction) {
	return x => x.junction === junction
}

function getNextNodeIndex(openList) {
	let low = Infinity
	let index = 0

	openList.forEach((waypoint, currentIndex) => {
		if (waypoint.f < low) {
			low = waypoint.f
			index = currentIndex
		}
	})
	return index
}

function getEuclideanDistance(current, target) {
	return ABS(current.x - target.x) + ABS(current.y - target.y)
}

function getWaypointJunctions({ junction }) {
	return ['Up', 'Down', 'Left', 'Right']
		.map(dir => junction[dir])
		.filter(junc => junc)
}

// climbs the parent tree of a waypoint and returns: 
//   an array of waypoints with array[0] being the root node of the path
function tracePath(endPoint) {
	const path = [endPoint]
	while (path[0].parent) {
		path.unshift(path[0].parent)
	}
	return path
}







/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__colors__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__constants__ = __webpack_require__(0);


// create player
/* harmony default export */ __webpack_exports__["default"] = (gameBoard) => ({
	pos: Object.assign({}, __WEBPACK_IMPORTED_MODULE_1__constants__["INITIAL_PLAYER_POS"]),
	vel: { x: 0, y: 0 },
	draw() {
		const { ctx } = gameBoard
		const { x, y } = this.pos
		const size = gameBoard.width / gameBoard.grid.size

		ctx.fillStyle = __WEBPACK_IMPORTED_MODULE_0__colors__["default"].PLAYER
		ctx.fillRect(x * size + 5, y * size + 5, size - 10, size - 10)
	},
	move(dir) {
		this.dir = dir
		this.vel.x = this.vel.y = 0
		// if no direction stop moving
		if (!dir) {
			return this.dir = null
		}

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
		this.move(this.dir)

		this.pos.x += this.vel.x
		this.pos.y += this.vel.y
	}
});


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(2);
__webpack_require__(1);
__webpack_require__(0);
__webpack_require__(3);
__webpack_require__(8);
__webpack_require__(2);
__webpack_require__(9);
__webpack_require__(10);
__webpack_require__(11);
__webpack_require__(4);
__webpack_require__(5);
__webpack_require__(6);
module.exports = __webpack_require__(7);


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = setupInterface;
function setupInterface(gameboard) {
  const startButton = createButton('START GAME', 'ui-button', e => {
    play(gameboard)
    gameboard.lastUpdate = performance.now()

    document.body.removeChild(e.target)
  })
  const gameOverButton = createButton('GAME OVER!', 'ui-button flashing disabled')
  const youWinButton = createButton('YOU WIN!!!', 'ui-button flashing disabled')

  document.body.appendChild(startButton)

  return {
    gameOver() {
      pause(gameboard)
      document.body.appendChild(gameOverButton)
    },
    win() {
      pause(gameboard)
      document.body.appendChild(youWinButton)
    }
  }
}

function play(gameboard) {
  return gameboard.pause = false
}
function pause(gameboard) {
  return gameboard.pause = true
}

function createButton(text, className, onclick) {
  const button = document.createElement('button')
  button.className = className
  button.onclick = onclick
  button.innerHTML = text

  return button
}


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map