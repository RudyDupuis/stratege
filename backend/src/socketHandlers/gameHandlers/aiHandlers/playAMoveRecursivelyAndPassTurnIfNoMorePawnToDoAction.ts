import GameState from '../../../../shared/gameState/entities/GameState'
import { PlayerRole } from '../../../../shared/gameState/entities/PlayerRoleEnum'
import Pawn from '../../../../shared/pawn/entities/Pawn'
import { Callback } from '../../socketHandlers'
import findBestRandomMove from './findBestRandomMove'
import { isDefined, isNull } from '../../../../shared/utils/TypeGuard'
import { passTurnAndHandleTurnTimer } from '../controlHandlers/passTurnHandler'
import { movePawn } from '../actionHandlers/movePawnHandler'
import { killPawn } from '../actionHandlers/killPawnHandler'
import { pullPawn } from '../actionHandlers/pullPawnHandler'
import { pushPawn } from '../actionHandlers/pushPawnHandler'
import { Server } from 'socket.io'
import { Action } from '../../../../shared/pawn/entities/ActionEnum'

export default function playAMoveRecursivelyAndPassTurnIfNoMorePawnToDoAction(
  gameState: GameState,
  roomId: string,
  aiRole: PlayerRole,
  aiPawns: Pawn[],
  io: Server,
  callback: Callback
) {
  if (isDefined(gameState.winner)) {
    return
  }

  const bestMove = findBestRandomMove(aiPawns, gameState, aiRole)

  if (isNull(bestMove)) {
    passTurnAndHandleTurnTimer(gameState, roomId, io)
    return
  }

  switch (bestMove.action) {
    case Action.Move:
      movePawn(gameState, roomId, aiRole, bestMove.pawn, bestMove.desiredPawnPosition, io, callback)
      break
    case Action.Kill:
      killPawn(gameState, roomId, aiRole, bestMove.pawn, bestMove.desiredPawnPosition, io, callback)
      break
    case Action.Pull:
      pullPawn(gameState, roomId, aiRole, bestMove.pawn, bestMove.desiredPawnPosition, io, callback)
      break
    case Action.Push:
      pushPawn(gameState, roomId, aiRole, bestMove.pawn, bestMove.desiredPawnPosition, io, callback)
      break
  }

  setTimeout(() => {
    playAMoveRecursivelyAndPassTurnIfNoMorePawnToDoAction(
      gameState,
      roomId,
      aiRole,
      aiPawns,
      io,
      callback
    )
  }, 1000)
}
