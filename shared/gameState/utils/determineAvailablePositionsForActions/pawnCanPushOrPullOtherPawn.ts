import PawnPosition from '../../../pawnPosition/entities/PawnPosition'
import GameState from '../../entities/GameState'

export default function pawnCanPushOrPullOtherPawn(
  gameState: GameState,
  arrivalPositionRow: number,
  arrivalPositionCol: number,
  positionsAvailable: PawnPosition[]
) {
  //If there is no pawn behind otherPawn and cell is in bounds (Pushing)
  //If there is no pawn below the current pawn and cell is in bounds (Pulling)
  if (
    GameState.isInBoardGameBounds(gameState.board, arrivalPositionRow, arrivalPositionCol) &&
    !GameState.isCellOccupied(gameState.board, arrivalPositionRow, arrivalPositionCol)
  ) {
    positionsAvailable.push(new PawnPosition(arrivalPositionRow, arrivalPositionCol))
  }
}
