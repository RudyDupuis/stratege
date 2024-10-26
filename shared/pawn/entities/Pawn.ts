import { Action, ReceivedAction } from './ActionEnum'
import { Player } from '../../gameState/entities/PlayerEnum'
import PawnPosition from '../../pawnPosition/entities/PawnPosition'
import { Orientation } from './OrientationEnum'
import type PawnDto from './PawnDto'

export default class Pawn implements PawnDto {
  constructor(
    public id: string,
    public owner: Player,
    public isAlive: boolean,
    public remainingMove: 0 | 1 | 2,
    public orientation: Orientation,
    public position: PawnPosition,
    public lastPosition?: PawnPosition,
    public lastAction?: Action | ReceivedAction
  ) {}
}
