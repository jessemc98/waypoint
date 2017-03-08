import {
  createJunction,
  createPlayer,
  createEnemy } from '../node.js'
import createGrid from '../grid.js'

const ABS = Math.abs
window.getNeighbours = checkJunctionForNeighbours
export default function waypointSystem(gameBoard) {
  const { player, enemies, grid } = gameBoard

  player.node = createPlayer(player.pos.x, player.pos.y)

  enemies.map(enemy =>
    enemy.node = createEnemy(enemy.pos.x, enemy.pos.y))

  let lastPos = Object.assign({}, player.node)
  return {
    update() {
      // if (player.pos.x === player.node.x && player.pos.y === player.node.y) return
      lastPos = Object.assign({}, player.node)
      const prevConnections = getJunctionNeighbours(player.node)

      player.node.clearLinks()
      updatePos(player.node, player.pos)

      linkJunctionToNeighbours(player.node, grid)

      const nodeAtPlayer = grid.getGridNode(player.node.x, player.node.y)
      if (nodeAtPlayer.type === 'grass') nodeAtPlayer.type = 'path'
      if (nodeAtPlayer.type === 'apple') {
        nodeAtPlayer.type = 'path'
        gameBoard.apples -= 1
      }
      if (gameBoard.apples === 0 ) {
        gameBoard.apples -= 1
        alert('YOU WIN!!!')
      }

      prevConnections.forEach(connection => linkJunctionToNeighbours(connection, grid, player.node))
      // console.log('previousNode', prevNode);
      // linkJunctionToNeighbours(prevNode, grid, player.node)



      enemies.forEach((enemy, i) => {
        const prevConnections = getJunctionNeighbours(enemy.node)
        enemy.node.clearLinks()

        updatePos(enemy.node, enemy.pos)
        linkJunctionToNeighbours(enemy.node, grid)

        prevConnections.forEach(connection => linkJunctionToNeighbours(connection, grid, player.node))
      })
    }
  }
}

// expects size to be an INT
// expects initialWaypoints to be an array with vector objects
// returns Grid with waypoints added to the grid and paths created between them
export function createWaypointGrid(size) {
  const waypointGrid = createGrid(size)
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
    .map(waypoint => createJunction(waypoint.x, waypoint.y))
    .map(junction => waypointGrid.setGridNode(junction.x, junction.y, junction))
    .map(junction => linkJunctionToNeighbours(junction, waypointGrid))

  return waypointGrid
}

// expects:
//   an array of exactly 2, currently linked, Junction nodes.
//   a Grid object
// sets every node between junctions to be of type 'path' if it is not of type 'junction'
function drawPathBetweenJunctions(junctions, grid) {
  const path = getPathBetweenJunctions(junctions[0], junctions[1])
    for (let next = path.next(); next = path.next();) {

      if (!next) return
      const gridNode = grid.getGridNode(next.x, next.y)

      // set node type to path if not a junction
      if (gridNode.type !== 'junction') gridNode.type = 'path'
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
      if (!(neighbour.type === 'junction' || neighbour.type === 'player')) {

        neighbour = createJunction(neighbour.x, neighbour.y)
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
        if (next.currNode.type === 'junction') {
          neighbours.push(next.currNode)
          return neighbours
        }
        if (next.currNode.type === 'grass' || next.currNode.type === 'apple') {
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
