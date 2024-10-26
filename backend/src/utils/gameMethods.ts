import Pawn from '../../shared/pawn/entities/Pawn'
import PawnPosition from '../../shared/pawnPosition/entities/PawnPosition'

export function calculatePawnRemainingMoves(pawn: Pawn, desiredPawnPosition: PawnPosition) {
  const moveDistance =
    Math.abs(pawn.position.row - desiredPawnPosition.row) +
    Math.abs(pawn.position.col - desiredPawnPosition.col)

  pawn.remainingMove -= moveDistance
}
