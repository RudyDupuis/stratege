import { PlayerRole } from '../../../shared/gameState/entities/PlayerRoleEnum'
import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import GameState from '../../../shared/gameState/entities/GameState'
import { isUndefined } from '../../../shared/utils/TypeGuard'
import winnerHandler from './winnerHandler'

export default function giveUpHandler(
  socket: Socket,
  games: Record<string, GameState>,
  gameTurnTimers: Record<string, NodeJS.Timeout>,
  io: Server
) {
  socket.on('giveUp', (roomId: string, player: PlayerRole, callback: Callback) => {
    const gameState = games[roomId]

    if (isUndefined(gameState)) {
      console.error("L'état de la partie est introuvable" + JSON.stringify(gameState))
      return callback(new Error("L'état de la partie est introuvable"))
    }

    gameState.winner = player === PlayerRole.Player1 ? PlayerRole.Player2 : PlayerRole.Player1

    winnerHandler(gameState, gameTurnTimers, roomId, io, callback)
  })
}
