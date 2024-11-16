import Pawn from '../../shared/pawn/entities/Pawn'
import PawnPosition from '../../shared/pawnPosition/entities/PawnPosition'

export function calculatePawnRemainingMoves(pawn: Pawn, desiredPawnPosition: PawnPosition) {
  const moveDistance =
    Math.abs(pawn.position.row - desiredPawnPosition.row) +
    Math.abs(pawn.position.col - desiredPawnPosition.col)

  pawn.remainingMove -= moveDistance
}

export function calculateEloScore(playerElo: number, opponentElo: number, didPlayerWin: boolean) {
  const K = 32
  const expectedScore = 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400))
  return Math.round(playerElo + K * ((didPlayerWin ? 1 : 0) - expectedScore))
}
