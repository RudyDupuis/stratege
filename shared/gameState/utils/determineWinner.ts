import Pawn from '../../pawn/entities/Pawn'
import GameState from '../entities/GameState'
import { Player } from '../entities/PlayerEnum'

export default function determineWinner(player1sLostPawns: Pawn[], player2sLostPawns: Pawn[]) {
  if (player1sLostPawns.length === GameState.MAX_PAWNS_PER_PLAYER) {
    return Player.Player2
  }
  if (player2sLostPawns.length === GameState.MAX_PAWNS_PER_PLAYER) {
    return Player.Player1
  }
}
