import GameState from '../../../../shared/gameState/entities/GameState'
import { isDefined, isUndefined } from '../../../../shared/utils/TypeGuard'
import { Server } from 'socket.io'
import { games } from './gameRecords'
import { passTurn } from '../controlHandlers/passTurnHandler'

export const gameTurnTimers: Record<string, NodeJS.Timeout> = {}

export function setTurnTimer(roomId: string, io: Server) {
  const gameState = games[roomId]

  if (isUndefined(gameState)) {
    deleteGameTurnTimer(roomId)
    return
  }

  let remainingTime = GameState.TURN_TIME_SECONDS

  gameTurnTimers[roomId] = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime -= 1
      io.to(roomId).emit('gameTurnRemainingTime', remainingTime)
    }
    if (remainingTime === 0) {
      clearTimeout(gameTurnTimers[roomId])
      passTurn(gameState, roomId, io)
      setTurnTimer(roomId, io)
    }
  }, 1000)
}

export function deleteGameTurnTimer(roomId: string) {
  if (isDefined(gameTurnTimers[roomId])) {
    clearTimeout(gameTurnTimers[roomId])
    delete gameTurnTimers[roomId]
  }
}
