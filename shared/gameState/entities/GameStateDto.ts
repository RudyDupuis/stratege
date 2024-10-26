import PawnDto from '../../pawn/entities/PawnDto'
import { Player } from './PlayerEnum'

export default interface GameStateDto {
  turn: number
  board: (PawnDto | null)[][]
  player1sLostPawns: PawnDto[]
  player2sLostPawns: PawnDto[]
  winner: Player | undefined
}
