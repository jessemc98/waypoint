export const GRID_SIZE = 16
export const GAME_STEP = (1000/60) * 12

export const TERMINATE_MOVEMENT = { x:0, y:0 }
export const OPPOSITES = {
	Left: 'Right',
	Right: 'Left',
	Up: 'Down',
	Down: 'Up'
}

export const NODE_TYPES = {
  apple: 'APPLE',
  // junction nodes
	junction: 'JUNCTION',
	player: 'PLAYER',
	enemy: 'ENEMY',
  // used for waypoint making and styling
  path: 'PATH',
  grass: 'GRASS'
}

// nodes which enemies cant step on
export const SOLID_NODES = ['GRASS', 'APPLE']

export const INITIAL_PLAYER_POS = {
  x: 0,
  y: GRID_SIZE / 2 -1
}
