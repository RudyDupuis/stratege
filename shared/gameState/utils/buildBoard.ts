import Pawn from '../../pawn/entities/Pawn'
import GameState from '../entities/GameState'

export default function buildBoard(boardPawns: Pawn[]) {
  const board: GameState['board'] = Array.from(Array(GameState.BOARD_HEIGHT), () => {
    return Array(GameState.BOARD_WIDTH).fill(null)
  })

  for (const pawn of boardPawns) {
    if (pawn.isAlive) {
      const position = pawn.position

      if (
        position.row >= 0 &&
        position.row < GameState.BOARD_HEIGHT &&
        position.col >= 0 &&
        position.col < GameState.BOARD_WIDTH
      ) {
        board[position.row][position.col] = pawn
      } else {
        throw new Error(`Position du pion (${position.row}, ${position.col}) hors du plateau.`)
      }
    }
  }

  return board
}
