import GameState from '../../../../../shared/gameState/entities/GameState'
import { PlayerRole } from '../../../../../shared/gameState/entities/PlayerRoleEnum'
import { Action } from '../../../../../shared/pawn/entities/ActionEnum'
import { Orientation } from '../../../../../shared/pawn/entities/OrientationEnum'
import actionToActionMatrice from './actionToActionMatrice'
import pawnIdToNumber from './pawnIdToNumber'

export type ActionWithPassTurn = Action | 'passTurn'

export default function boardAndActionsDataToStateMatriceAndActionsMatrice(
  gameState: GameState,
  aiRole: PlayerRole
) {
  let pawnsPositionsOnBoardMatrice: number[] = []

  gameState.board.forEach((row) => {
    row.forEach((pawn) => {
      if (pawn === null) {
        pawnsPositionsOnBoardMatrice.push(0)
        pawnsPositionsOnBoardMatrice.push(0)
      } else {
        pawnsPositionsOnBoardMatrice.push(pawnIdToNumber(pawn).player)
        pawnsPositionsOnBoardMatrice.push(pawnIdToNumber(pawn).number)
      }
    })
  })

  let pawnsInfosMatrice: number[] = []

  gameState.boardPawns.forEach((pawn) => {
    pawnsInfosMatrice.push(pawnIdToNumber(pawn).player)
    pawnsInfosMatrice.push(pawnIdToNumber(pawn).number)
    pawnsInfosMatrice.push(pawn.isAlive ? 1 : 0)
    pawnsInfosMatrice.push(pawn.remainingMove)
    pawnsInfosMatrice.push(pawn.orientation === Orientation.NE ? 1 : 0)
    pawnsInfosMatrice.push(pawn.orientation === Orientation.NW ? 1 : 0)
    pawnsInfosMatrice.push(pawn.orientation === Orientation.SE ? 1 : 0)
    pawnsInfosMatrice.push(pawn.orientation === Orientation.SW ? 1 : 0)
  })

  const stateMatrice = [...pawnsPositionsOnBoardMatrice, ...pawnsInfosMatrice]

  const playerPawns = gameState.boardPawns.filter((pawn) => {
    return pawn.owner === aiRole && pawn.isAlive
  })

  //Each action is merged with board infos
  let actionsMatrice: number[][] = []

  playerPawns.forEach((pawn) => {
    const availablePositionsForActions = gameState.determineAvailablePositionsForActions(
      pawn,
      aiRole
    )

    availablePositionsForActions.positionsAvailableForMoving.forEach((position) =>
      actionsMatrice.push(actionToActionMatrice(Action.Move, pawn, position))
    )

    availablePositionsForActions.positionsAvailableForKilling.forEach((position) =>
      actionsMatrice.push(actionToActionMatrice(Action.Kill, pawn, position))
    )

    availablePositionsForActions.positionsAvailableForPushing.forEach((position) =>
      actionsMatrice.push(actionToActionMatrice(Action.Push, pawn, position))
    )

    availablePositionsForActions.positionsAvailableForPulling.forEach((position) =>
      actionsMatrice.push(actionToActionMatrice(Action.Pull, pawn, position))
    )

    if (pawn.lastAction !== Action.Rotate) {
      for (const orientation of Object.values(Orientation)) {
        if (orientation !== pawn.orientation) {
          actionsMatrice.push(actionToActionMatrice(Action.Rotate, pawn, undefined, orientation))
        }
      }
    }
  })

  actionsMatrice.push(actionToActionMatrice('passTurn'))

  return { stateMatrice, actionsMatrice }
}
