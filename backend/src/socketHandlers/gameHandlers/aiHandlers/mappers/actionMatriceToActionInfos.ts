import GameState from '../../../../../shared/gameState/entities/GameState'
import Pawn from '../../../../../shared/pawn/entities/Pawn'
import { ActionWithPassTurn } from './boardAndActionsDataToStateMatriceAndActionsMatrice'
import { Action } from '../../../../../shared/pawn/entities/ActionEnum'
import { isUndefined } from '../../../../../shared/utils/TypeGuard'
import PawnPosition from '../../../../../shared/pawnPosition/entities/PawnPosition'
import { Orientation } from '../../../../../shared/pawn/entities/OrientationEnum'

export default function actionMatriceToActionInfos(actionMatrice: string, gameState: GameState) {
  const actionMatriceArray = Array.from(actionMatrice, (char) => parseInt(char))

  const pawnId =
    actionMatriceArray[0] === 0 && actionMatriceArray[1] === 0
      ? null
      : `p${actionMatriceArray[0]}-${actionMatriceArray[1]}`

  let pawn: Pawn | undefined
  gameState.boardPawns.forEach((currentPawn) => {
    if (currentPawn.id === pawnId) {
      pawn = currentPawn
      return
    }
  })

  let action: ActionWithPassTurn | undefined
  if (actionMatriceArray[2] === 1) {
    action = Action.Move
  }
  if (actionMatriceArray[3] === 1) {
    action = Action.Kill
  }
  if (actionMatriceArray[4] === 1) {
    action = Action.Push
  }
  if (actionMatriceArray[5] === 1) {
    action = Action.Pull
  }
  if (actionMatriceArray[6] === 1) {
    action = Action.Rotate
  }
  if (actionMatriceArray[7] === 1) {
    action = 'passTurn'
  }

  if (isUndefined(action)) {
    throw new Error('Action undefined during actionMatriceToAction')
  }

  let position: PawnPosition | undefined
  if (
    action === Action.Move ||
    action === Action.Kill ||
    action === Action.Push ||
    action === Action.Pull
  ) {
    position = new PawnPosition(actionMatriceArray[8], actionMatriceArray[9])
  }

  let orientation: Orientation | undefined
  if (action === Action.Rotate) {
    if (actionMatriceArray[10] === 1) {
      orientation = Orientation.NE
    }
    if (actionMatriceArray[11] === 1) {
      orientation = Orientation.NW
    }
    if (actionMatriceArray[12] === 1) {
      orientation = Orientation.SE
    }
    if (actionMatriceArray[13] === 1) {
      orientation = Orientation.SW
    }
  }

  return { pawn, action, position, orientation }
}
