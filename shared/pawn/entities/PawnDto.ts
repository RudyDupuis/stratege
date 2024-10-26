import { Player } from '../../gameState/entities/PlayerEnum'
import { Orientation } from './OrientationEnum'

export default interface PawnDto {
  id: string
  owner: Player
  remainingMove: 0 | 1 | 2
  orientation: Orientation
}
