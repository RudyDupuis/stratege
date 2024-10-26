import Pawn from '../entities/Pawn'
import PawnDto from '../entities/PawnDto'

export default function pawnDtoToEntity(pawn: PawnDto) {
  return new Pawn(pawn.id, pawn.owner, pawn.remainingMove, pawn.orientation)
}
