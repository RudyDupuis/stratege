import { PlayerRole } from '../../../shared/gameState/entities/PlayerRoleEnum'
import Pawn from '../../../shared/pawn/entities/Pawn'

export default function pawnIdToNumber(pawn: Pawn) {
  return {
    player: pawn.owner === PlayerRole.Player1 ? 1 : 2,
    number: parseInt(pawn.id.split('-')[1])
  }
}
