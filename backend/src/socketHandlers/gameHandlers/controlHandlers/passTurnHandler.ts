import { PlayerRole } from '../../../../shared/gameState/entities/PlayerRoleEnum'
import { Server, Socket } from 'socket.io'
import { Callback } from '../../socketHandlers'
import GameState from '../../../../shared/gameState/entities/GameState'
import { checkIfGameExistAndIfIsPlayerTurn } from '../../utils/game/gameChecks'
import { games } from '../record/gameRecords'
import { deleteGameTurnTimer, setTurnTimer } from '../record/gameTurnTimerRecords'

export function passTurnHandler(socket: Socket, io: Server) {
  socket.on('passTurn', (roomId: string, player: PlayerRole, callback: Callback) => {
    const gameState = games[roomId]

    try {
      checkIfGameExistAndIfIsPlayerTurn(gameState, player)
    } catch (error) {
      return callback({ error: error })
    }

    deleteGameTurnTimer(roomId)
    passTurn(gameState, roomId, io)
    setTurnTimer(roomId, io)
  })
}

export function passTurn(gameState: GameState, roomId: string, io: Server) {
  gameState.turn += 1
  gameState.resetRemainingMovesPawns()
  gameState.resetLastActionAndPositionPawns()
  io.to(roomId).emit('gameState', gameState)
}
