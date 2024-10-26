import { Orientation } from '../../../pawn/entities/OrientationEnum'
import Pawn from '../../../pawn/entities/Pawn'
import PawnPosition from '../../../pawnPosition/entities/PawnPosition'

export default function pawnCanKillOtherPawn(
  otherPawn: Pawn,
  orientation1: Orientation,
  orientation2: Orientation,
  positionsAvailableForKilling: PawnPosition[],
  newPosition: PawnPosition
) {
  if (otherPawn.orientation === orientation1 || otherPawn.orientation === orientation2) {
    positionsAvailableForKilling.push(newPosition)
  }
}
