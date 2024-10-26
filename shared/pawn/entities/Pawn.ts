import { Player } from '../../gameState/entities/PlayerEnum'
import { Orientation } from './OrientationEnum'

export default class Pawn {
  constructor(
    public id: string,
    public owner: Player,
    public remainingMove: 0 | 1 | 2,
    public orientation: Orientation
  ) {}
}
