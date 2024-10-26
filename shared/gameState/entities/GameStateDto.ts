import type PawnDto from '../../pawn/entities/PawnDto'
import { Player } from './PlayerEnum'

export default interface GameStateDto {
  turn: number
  boardPawns: PawnDto[]
  winner?: Player
}
