import Pawn from '../../pawn/entities/Pawn'
import { PlayerRole } from '../entities/PlayerRoleEnum'

export default function determinePlayersLostPawns(boardPawns: Pawn[]) {
  const player1sLostPawns = boardPawns.filter(
    (pawn) => pawn.owner === PlayerRole.Player1 && !pawn.isAlive
  )
  const player2sLostPawns = boardPawns.filter(
    (pawn) => pawn.owner === PlayerRole.Player2 && !pawn.isAlive
  )

  return { player1sLostPawns, player2sLostPawns }
}
