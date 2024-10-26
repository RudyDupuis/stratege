import GameState from '../../shared/gameState/entities/GameState'
import Pawn from '../../shared/pawn/entities/Pawn'
import PawnPosition from '../../shared/pawnPosition/entities/PawnPosition'

export function calculatePawnRemainingMoves(pawn: Pawn, desiredPawnPosition: PawnPosition) {
  const moveDistance =
    Math.abs(pawn.position.row - desiredPawnPosition.row) +
    Math.abs(pawn.position.col - desiredPawnPosition.col)

  pawn.remainingMove -= moveDistance
}

export function findPawnByPosition(
  boardPawns: GameState['boardPawns'],
  pawnPosition: PawnPosition
) {
  return boardPawns.find((pawn) => {
    return (
      pawn.position.row === pawnPosition.row &&
      pawn.position.col === pawnPosition.col &&
      pawn.isAlive
    )
  })
}
