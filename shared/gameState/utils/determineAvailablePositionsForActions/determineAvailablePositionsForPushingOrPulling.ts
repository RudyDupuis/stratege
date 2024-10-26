import Pawn from '../../../pawn/entities/Pawn'
import PawnPosition from '../../../pawnPosition/entities/PawnPosition'
import GameState from '../../entities/GameState'
import {
  PAWN_POSITION_BOTTOM,
  PAWN_POSITION_DIRECTIONS,
  PAWN_POSITION_LEFT,
  PAWN_POSITION_RIGHT,
  PAWN_POSITION_TOP
} from './determineAvailablePositionsForActions'
import pawnCanPushOrPullOtherPawn from './pawnCanPushOrPullOtherPawn'

export default function determineAvailablePositionsForPushingOrPulling(
  gameState: GameState,
  pawn: Pawn,
  positionsAvailableForPushing: PawnPosition[],
  positionsAvailableForPulling: PawnPosition[]
) {
  if (pawn.remainingMove === 0) {
    return
  }

  for (const direction of PAWN_POSITION_DIRECTIONS) {
    const newRow = pawn.position.row + direction.row
    const newCol = pawn.position.col + direction.col

    if (
      GameState.isInBoardGameBounds(gameState.board, newRow, newCol) &&
      GameState.isCellOccupied(gameState.board, newRow, newCol)
    ) {
      switch (direction) {
        case PAWN_POSITION_TOP:
          pawnCanPushOrPullOtherPawn(gameState, newRow - 1, newCol, positionsAvailableForPushing)
          pawnCanPushOrPullOtherPawn(gameState, newRow + 2, newCol, positionsAvailableForPulling)
          break

        case PAWN_POSITION_BOTTOM:
          pawnCanPushOrPullOtherPawn(gameState, newRow + 1, newCol, positionsAvailableForPushing)
          pawnCanPushOrPullOtherPawn(gameState, newRow - 2, newCol, positionsAvailableForPulling)
          break

        case PAWN_POSITION_LEFT:
          pawnCanPushOrPullOtherPawn(gameState, newRow, newCol - 1, positionsAvailableForPushing)
          pawnCanPushOrPullOtherPawn(gameState, newRow, newCol + 2, positionsAvailableForPulling)
          break

        case PAWN_POSITION_RIGHT:
          pawnCanPushOrPullOtherPawn(gameState, newRow, newCol + 1, positionsAvailableForPushing)
          pawnCanPushOrPullOtherPawn(gameState, newRow, newCol - 2, positionsAvailableForPulling)
      }
    }
  }
}
