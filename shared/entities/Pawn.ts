import { Orientation, Player } from '../Enum'

export interface PawnDto {
  id: string
  owner: Player
  remainingMove: 0 | 1 | 2
  orientation: Orientation
}
export class Pawn {
  constructor(
    public id: string,
    public owner: Player,
    public remainingMove: 0 | 1 | 2,
    public orientation: Orientation
  ) {}
}
