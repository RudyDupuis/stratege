import pawnPositionDtoToEntity from '../../pawnPosition/mappers/pawnPositionMapper'
import Pawn from '../entities/Pawn'
import type PawnDto from '../entities/PawnDto'
import { isDefined } from '../../utils/TypeGuard'

export default function pawnDtoToEntity(pawn: PawnDto) {
  return new Pawn(
    pawn.id,
    pawn.owner,
    pawn.isAlive,
    pawn.remainingMove,
    pawn.orientation,
    pawnPositionDtoToEntity(pawn.position),
    isDefined(pawn.lastPosition) ? pawnPositionDtoToEntity(pawn.lastPosition) : undefined,
    pawn.lastAction
  )
}
