import GameState from '../../../../shared/gameState/entities/GameState'
import { isDefined, isUndefined } from '../../../../shared/utils/TypeGuard'
import { Server } from 'socket.io'
import { games } from './gameRecords'
import { passTurn } from '../controlHandlers/passTurnHandler'
import { rooms } from '../../roomHandlers/record/roomRecords'
import { PlayerRole } from '../../../../shared/gameState/entities/PlayerRoleEnum'
import endGameHandler from '../../utils/game/endGameHandler'

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

      if (rooms[roomId].type === 'ai') {
        gameState.winner = PlayerRole.Player2

        endGameHandler(roomId, io, () => {})
        return
      }

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
