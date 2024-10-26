import { Player } from '../../../shared/gameState/entities/PlayerEnum'
import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import GameState from '../../../shared/gameState/entities/GameState'
import { checkIfGameExistAndIfIsPlayerTurn } from '../../utils/gameChecks'

export default function passTurnHandler(
  socket: Socket,
  games: Record<string, GameState>,
  io: Server
) {
  socket.on('passTurn', (roomId: string, player: Player, callback: Callback) => {
    const gameState = games[roomId]

    try {
      checkIfGameExistAndIfIsPlayerTurn(gameState, player)
    } catch (error) {
      return callback({ error: error })
    }

    gameState.turn += 1
    gameState.resetRemainingMovesPawns()

    io.to(roomId).emit('gameState', gameState)
  })
}
