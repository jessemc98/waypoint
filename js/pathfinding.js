const ABS = Math.abs

export function createInitialWayPoint(initial, target) {
	return {
		junction: initial,
		h: getEuclideanDistance(initial, target),
		g: 0
	}
}

export function getWaypointJunctionNodes(wayPoint, target) {
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
export function findPath(current, target) {
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
export function findJunction(junction) {
	return x => x.junction === junction
}

export function getNextNodeIndex(openList) {
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

export function getEuclideanDistance(current, target) {
	return ABS(current.x - target.x) + ABS(current.y - target.y)
}

export function getWaypointJunctions({ junction }) {
	return ['Up', 'Down', 'Left', 'Right']
		.map(dir => junction[dir])
		.filter(junc => junc)
}

// climbs the parent tree of a waypoint and returns: 
//   an array of waypoints with array[0] being the root node of the path
export function tracePath(endPoint) {
	const path = [endPoint]
	while (path[0].parent) {
		path.unshift(path[0].parent)
	}
	return path
}





