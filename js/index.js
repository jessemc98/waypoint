import GameBoard from './gameboard'

const canvas = document.getElementById('game')
const game = GameBoard(canvas)
game.init()

window.game = game
// TODO create enemy
// TODO add enemy pathfinding using dvorska and implemented PathNode types


