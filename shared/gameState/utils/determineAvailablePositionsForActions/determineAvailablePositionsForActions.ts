import Pawn from '../../../pawn/entities/Pawn'
import PawnPosition from '../../../pawnPosition/entities/PawnPosition'
import GameState from '../../entities/GameState'
import { PlayerRole } from '../../entities/PlayerRoleEnum'
import determineAvailablePositionsForMovingOrKillingByMovingOneCellAtATime from './determineAvailablePositionsForMovingOrKillingByMovingOneCellAtATime'
import determineAvailablePositionsForPushingOrPulling from './determineAvailablePositionsForPushingOrPulling'

export const PAWN_POSITION_TOP = new PawnPosition(-1, 0)
export const PAWN_POSITION_BOTTOM = new PawnPosition(1, 0)
export const PAWN_POSITION_LEFT = new PawnPosition(0, -1)
export const PAWN_POSITION_RIGHT = new PawnPosition(0, 1)
export const PAWN_POSITION_DIRECTIONS = [
  PAWN_POSITION_TOP,
  PAWN_POSITION_BOTTOM,
  PAWN_POSITION_LEFT,
  PAWN_POSITION_RIGHT
]

export interface PositionsAvailableForActions {
  positionsAvailableForMoving: PawnPosition[]
  positionsAvailableForKilling: PawnPosition[]
  positionsAvailableForPushing: PawnPosition[]
  positionsAvailableForPulling: PawnPosition[]
}

export function determineAvailablePositionsForActions(
  gameState: GameState,
  pawn: Pawn,
  player: PlayerRole
): PositionsAvailableForActions {
  const positionsAvailableForMoving: PawnPosition[] = []
  const positionsAvailableForKilling: PawnPosition[] = []
  const positionsAvailableForPushing: PawnPosition[] = []
  const positionsAvailableForPulling: PawnPosition[] = []

  determineAvailablePositionsForMovingOrKillingByMovingOneCellAtATime(
    gameState,
    pawn.position,
    pawn.remainingMove,
    player,
    positionsAvailableForMoving,
    positionsAvailableForKilling
  )

  determineAvailablePositionsForPushingOrPulling(
    gameState,
    pawn,
    positionsAvailableForPushing,
    positionsAvailableForPulling
  )

  return {
    positionsAvailableForMoving,
    positionsAvailableForKilling,
    positionsAvailableForPushing,
    positionsAvailableForPulling
  }
}
