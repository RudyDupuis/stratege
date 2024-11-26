import { PlayerRole } from '../../../shared/gameState/entities/PlayerRoleEnum'
import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import GameState from '../../../shared/gameState/entities/GameState'
import { checkIfGameExistAndIfIsPlayerTurn } from '../../utils/gameChecks'
import { isDefined, isUndefined } from '../../../shared/utils/TypeGuard'

export function passTurnHandler(
  socket: Socket,
  games: Record<string, GameState>,
  gameTurnTimers: Record<string, NodeJS.Timeout>,
  io: Server
) {
  socket.on('passTurn', (roomId: string, player: PlayerRole, callback: Callback) => {
    const gameState = games[roomId]

    try {
      checkIfGameExistAndIfIsPlayerTurn(gameState, player)
    } catch (error) {
      return callback({ error: error })
    }

    if (gameTurnTimers[roomId]) {
      clearTimeout(gameTurnTimers[roomId])
    }

    passTurn(gameState, roomId, io)
    setTurnTimer(gameState, games, gameTurnTimers, roomId, io)
  })
}

function passTurn(gameState: GameState, roomId: string, io: Server) {
  gameState.turn += 1
  gameState.resetRemainingMovesPawns()
  gameState.resetLastActionAndPositionPawns()
  io.to(roomId).emit('gameState', gameState)
}

export function setTurnTimer(
  gameState: GameState,
  games: Record<string, GameState>,
  gameTurnTimers: Record<string, NodeJS.Timeout>,
  roomId: string,
  io: Server
) {
  if (isUndefined(games[roomId])) {
    if (isDefined(gameTurnTimers[roomId])) {
      clearTimeout(gameTurnTimers[roomId])
      delete gameTurnTimers[roomId]
    }
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
      setTurnTimer(gameState, games, gameTurnTimers, roomId, io)
    }
  }, 1000)
}
