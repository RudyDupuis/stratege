import { Action, ReceivedAction } from './ActionEnum'
import { Player } from '../../gameState/entities/PlayerEnum'
import type PawnPositionDto from '../../pawnPosition/entities/PawnPositionDto'
import { Orientation } from './OrientationEnum'

export default interface PawnDto {
  id: string
  owner: Player
  isAlive: boolean
  remainingMove: 0 | 1 | 2
  orientation: Orientation
  position: PawnPositionDto
  lastPosition?: PawnPositionDto
  lastAction?: Action | ReceivedAction
}
