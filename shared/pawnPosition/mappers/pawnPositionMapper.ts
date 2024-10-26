import PawnPosition from '../entities/PawnPosition'
import PawnPositionDto from '../entities/PawnPositionDto'

export default function pawnPositionDtoToEntity(pawnPosition: PawnPositionDto) {
  return new PawnPosition(pawnPosition.row, pawnPosition.col)
}
