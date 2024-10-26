import Pawn from '../../shared/pawn/entities/Pawn'
import PawnPosition from '../../shared/pawnPosition/entities/PawnPosition'

export function calculatePawnRemainingMoves(
  currentPawnPosition: PawnPosition,
  desiredPawnPosition: PawnPosition,
  instancedPawn: Pawn
) {
  const moveDistance =
    Math.abs(currentPawnPosition.row - desiredPawnPosition.row) +
    Math.abs(currentPawnPosition.col - desiredPawnPosition.col)

  instancedPawn.remainingMove -= moveDistance
}
