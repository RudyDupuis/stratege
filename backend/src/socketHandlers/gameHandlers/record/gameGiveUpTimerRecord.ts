import GameState from '../../../../shared/gameState/entities/GameState'
import { PlayerRole } from '../../../../shared/gameState/entities/PlayerRoleEnum'
import { Server } from 'socket.io'
import { games } from './gameRecords'
import { isDefined, isUndefined } from '../../../../shared/utils/TypeGuard'
import endGameHandler from '../../utils/game/endGameHandler'

export const gameGiveUpTimers: Record<string, NodeJS.Timeout> = {}

export function setGameGiveUpTimer(roomId: string, disconnectedPlayerRole: PlayerRole, io: Server) {
  const gameState = games[roomId]

  if (isUndefined(gameState)) {
    deleteGameGiveUpTimer(roomId)
    return
  }

  let remainingTime = GameState.GIVE_UP_TIME_SECONDS

  gameGiveUpTimers[roomId] = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime -= 1
      io.to(roomId).emit('gameGiveUpRemainingTime', remainingTime)
    }
    if (remainingTime === 0) {
      deleteGameGiveUpTimer(roomId)

      gameState.winner =
        disconnectedPlayerRole === PlayerRole.Player1 ? PlayerRole.Player2 : PlayerRole.Player1
      endGameHandler(roomId, io, () => {})
    }
  }, 1000)
}

export function deleteGameGiveUpTimer(roomId: string) {
  if (isDefined(gameGiveUpTimers[roomId])) {
    clearTimeout(gameGiveUpTimers[roomId])
    delete gameGiveUpTimers[roomId]
  }
}
