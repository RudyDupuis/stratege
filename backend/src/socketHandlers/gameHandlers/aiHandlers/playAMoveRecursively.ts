import { PlayerRole } from '../../../../shared/gameState/entities/PlayerRoleEnum'
import { Callback } from '../../socketHandlers'
import { isDefined, isUndefined } from '../../../../shared/utils/TypeGuard'
import { movePawn } from '../actionHandlers/movePawnHandler'
import { killPawn } from '../actionHandlers/killPawnHandler'
import { pullPawn } from '../actionHandlers/pullPawnHandler'
import { pushPawn } from '../actionHandlers/pushPawnHandler'
import { Server } from 'socket.io'
import { Action } from '../../../../shared/pawn/entities/ActionEnum'
import { loadModel, predictAction } from './modelHandler'
import boardAndActionsDataToStateMatriceAndActionsMatrice from './mappers/boardAndActionsDataToStateMatriceAndActionsMatrice'
import actionMatriceToActionInfos from './mappers/actionMatriceToActionInfos'
import { rotatePawn } from '../actionHandlers/rotatePawnHandler'
import { passTurnAndHandleTurnTimer } from '../controlHandlers/passTurnHandler'
import { games } from '../record/gameRecords'
import { rooms } from '../../roomHandlers/record/roomRecords'

export default async function playAMoveRecursively(roomId: string, io: Server, callback: Callback) {
  const gameState = games[roomId]
  const aiRole = PlayerRole.Player2
  const aiLevel = rooms[roomId].aiLevel

  if (
    isDefined(gameState.winner) ||
    gameState.determinePlayerBasedOnTurn() !== aiRole ||
    isUndefined(aiLevel)
  ) {
    return
  }

  const model = await loadModel(aiLevel)

  const { stateMatrice, actionsMatrice } = boardAndActionsDataToStateMatriceAndActionsMatrice(
    gameState,
    aiRole
  )
  const chosenActionMatrice = await predictAction(model, stateMatrice, actionsMatrice)
  const chosenActionInformations = actionMatriceToActionInfos(chosenActionMatrice, gameState)

  switch (chosenActionInformations.action) {
    case Action.Move:
      movePawn(
        gameState,
        roomId,
        aiRole,
        chosenActionInformations.pawn!,
        chosenActionInformations.position!,
        io,
        callback
      )
      break
    case Action.Kill:
      killPawn(
        gameState,
        roomId,
        aiRole,
        chosenActionInformations.pawn!,
        chosenActionInformations.position!,
        io,
        callback
      )
      break
    case Action.Pull:
      pullPawn(
        gameState,
        roomId,
        aiRole,
        chosenActionInformations.pawn!,
        chosenActionInformations.position!,
        io,
        callback
      )
      break
    case Action.Push:
      pushPawn(
        gameState,
        roomId,
        aiRole,
        chosenActionInformations.pawn!,
        chosenActionInformations.position!,
        io,
        callback
      )
      break
    case Action.Rotate:
      rotatePawn(
        gameState,
        roomId,
        aiRole,
        chosenActionInformations.pawn!,
        chosenActionInformations.orientation!,
        io,
        callback
      )
      break
    case 'passTurn':
      passTurnAndHandleTurnTimer(gameState, roomId, io)
      break
  }

  setTimeout(() => {
    playAMoveRecursively(roomId, io, callback)
  }, 1000)
}
