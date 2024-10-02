import { Player } from '@shared/Enum'
import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import { GameState } from '@shared/entities/GameState'
import { checkIfGameExistAndIfIsPlayerTurn } from '@/helpers/gameChecks'

export default function passTurnHandler(
  socket: Socket,
  games: Record<string, GameState>,
  io: Server
) {
  socket.on('passTurn', (roomId: string, player: Player, callback: Callback) => {
    const game = games[roomId]

    try {
      checkIfGameExistAndIfIsPlayerTurn(game, player)
    } catch (error) {
      return callback({ error: error })
    }

    game.turn += 1
    game.resetRemainingMoves()

    io.to(roomId).emit('gameState', game)
  })
}
