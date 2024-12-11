import GameState from '../../../../shared/gameState/entities/GameState'
import { isDefined } from '../../../../shared/utils/TypeGuard'
import { Server } from 'socket.io'
import { Callback } from '../../../socketHandlers/socketHandlers'
import initialBoardPawns from '../../../../shared/gameState/utils/initialBoardPawns'
import { deleteGameGiveUpTimer } from './gameGiveUpTimerRecord'
import { setTurnTimer } from './gameTurnTimerRecords'
import { rooms } from '../../roomHandlers/record/roomRecords'

export const games: Record<string, GameState> = {}

export function createOrRetrieveGame(roomId: string, io: Server, callback: Callback) {
  if (isDefined(games[roomId])) {
    if (isDefined(games[roomId].winner)) {
      return callback({ error: 'La partie est finie' })
    }

    deleteGameGiveUpTimer(roomId)
    return io.to(roomId).emit('gameState', games[roomId])
  }

  const newGame = new GameState(1, initialBoardPawns())

  games[roomId] = newGame
  io.to(roomId).emit('gameState', newGame)

  if (rooms[roomId].type !== 'ai') {
    setTurnTimer(roomId, io)
  }
}

export function deleteGame(roomId: string) {
  delete games[roomId]
}
