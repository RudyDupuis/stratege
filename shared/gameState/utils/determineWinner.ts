import Pawn from '../../pawn/entities/Pawn'
import GameState from '../entities/GameState'
import { PlayerRole } from '../entities/PlayerRoleEnum'

export default function determineWinner(player1sLostPawns: Pawn[], player2sLostPawns: Pawn[]) {
  if (player1sLostPawns.length === GameState.MAX_PAWNS_PER_PLAYER) {
    return PlayerRole.Player2
  }
  if (player2sLostPawns.length === GameState.MAX_PAWNS_PER_PLAYER) {
    return PlayerRole.Player1
  }
}
