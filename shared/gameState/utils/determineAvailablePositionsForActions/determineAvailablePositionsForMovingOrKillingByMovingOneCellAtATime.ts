import { Orientation } from '../../../pawn/entities/OrientationEnum'
import PawnPosition from '../../../pawnPosition/entities/PawnPosition'
import GameState from '../../entities/GameState'
import { Player } from '../../entities/PlayerEnum'
import {
  PAWN_POSITION_BOTTOM,
  PAWN_POSITION_DIRECTIONS,
  PAWN_POSITION_LEFT,
  PAWN_POSITION_RIGHT,
  PAWN_POSITION_TOP
} from './determineAvailablePositionsForActions'
import pawnCanKillOtherPawn from './pawnCanKillOtherPawn'

export default function determineAvailablePositionsForMovingOrKillingByMovingOneCellAtATime(
  gameState: GameState,
  currentPosition: PawnPosition,
  remainingMove: number,
  player: Player,
  positionsAvailableForMoving: PawnPosition[],
  positionsAvailableForKilling: PawnPosition[]
) {
  if (remainingMove === 0) {
    return
  }

  for (const direction of PAWN_POSITION_DIRECTIONS) {
    const newRow = currentPosition.row + direction.row
    const newCol = currentPosition.col + direction.col
    const newPosition = new PawnPosition(newRow, newCol)

    if (GameState.isInBoardGameBounds(gameState.board, newRow, newCol)) {
      if (GameState.isCellOccupied(gameState.board, newRow, newCol)) {
        const otherPawn = gameState.findPawnByPosition(newPosition)

        if (otherPawn.owner !== player) {
          switch (direction) {
            case PAWN_POSITION_TOP:
              pawnCanKillOtherPawn(
                otherPawn,
                Orientation.NW,
                Orientation.NE,
                positionsAvailableForKilling,
                newPosition
              )
              break

            case PAWN_POSITION_BOTTOM:
              pawnCanKillOtherPawn(
                otherPawn,
                Orientation.SW,
                Orientation.SE,
                positionsAvailableForKilling,
                newPosition
              )
              break

            case PAWN_POSITION_LEFT:
              pawnCanKillOtherPawn(
                otherPawn,
                Orientation.NW,
                Orientation.SW,
                positionsAvailableForKilling,
                newPosition
              )
              break

            case PAWN_POSITION_RIGHT:
              pawnCanKillOtherPawn(
                otherPawn,
                Orientation.SE,
                Orientation.NE,
                positionsAvailableForKilling,
                newPosition
              )
              break
          }
        }
      } else {
        if (!positionsAvailableForMoving.some((pos) => pos.row === newRow && pos.col === newCol)) {
          positionsAvailableForMoving.push(newPosition)
          determineAvailablePositionsForMovingOrKillingByMovingOneCellAtATime(
            gameState,
            newPosition,
            remainingMove - 1,
            player,
            positionsAvailableForMoving,
            positionsAvailableForKilling
          )
        }
      }
    }
  }
}
