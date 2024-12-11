import { PlayerRole } from '../../../../shared/gameState/entities/PlayerRoleEnum'
import { Server, Socket } from 'socket.io'
import { Callback } from '../../socketHandlers'
import GameState from '../../../../shared/gameState/entities/GameState'
import { checkIfGameExistAndIfIsPlayerTurn } from '../../utils/game/gameChecks'
import { games } from '../record/gameRecords'
import { deleteGameTurnTimer, setTurnTimer } from '../record/gameTurnTimerRecords'
import { rooms } from '../../roomHandlers/record/roomRecords'
import aiHandlers from '../../../aiHandlers/aiHandlers'
import { RoomType } from '../../../../shared/room/entities/RoomTypeEnum'

export function passTurnHandler(socket: Socket, io: Server) {
  socket.on('passTurn', (roomId: string, player: PlayerRole, callback: Callback) => {
    const gameState = games[roomId]

    try {
      checkIfGameExistAndIfIsPlayerTurn(gameState, player)
    } catch (error) {
      return callback({ error: error })
    }

    passTurnAndHandleTurnTimer(gameState, roomId, io)

    if (rooms[roomId].type === RoomType.AI) {
      aiHandlers(roomId, io, callback)
    }
  })
}

export function passTurnAndHandleTurnTimer(gameState: GameState, roomId: string, io: Server) {
  passTurn(gameState, roomId, io)

  if (rooms[roomId].type !== RoomType.AI) {
    deleteGameTurnTimer(roomId)
    setTurnTimer(roomId, io)
  }
}

export function passTurn(gameState: GameState, roomId: string, io: Server) {
  gameState.turn += 1
  gameState.resetRemainingMovesPawns()
  gameState.resetLastActionAndPositionPawns()
  io.to(roomId).emit('gameState', gameState)
}
