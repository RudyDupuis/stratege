import Pawn from '../../pawn/entities/Pawn'
import { Player } from '../entities/PlayerEnum'

export default function determinePlayersLostPawns(boardPawns: Pawn[]) {
  const player1sLostPawns = boardPawns.filter(
    (pawn) => pawn.owner === Player.Player1 && !pawn.isAlive
  )
  const player2sLostPawns = boardPawns.filter(
    (pawn) => pawn.owner === Player.Player2 && !pawn.isAlive
  )

  return { player1sLostPawns, player2sLostPawns }
}
