import type PawnDto from '../../pawn/entities/PawnDto'
import { PlayerRole } from './PlayerRoleEnum'

export default interface GameStateDto {
  turn: number
  boardPawns: PawnDto[]
  winner?: PlayerRole
}
