import { GameState } from '../../../shared/entities/GameState'
import { Server, Socket } from 'socket.io'
import passTurnHandler from './passTurnHandler'
import movePawnHandler from './movePawnHandler'
import killPawnHandler from './killPawnHandler'
import pushPawnHandler from './pushPawnHandler'
import pullPawnHandler from './pullPawnHandler'
import rotatePawnHandler from './rotatePawnHandler'
import { isDefined } from '../../../shared/helpers/TypeGuard'

const games: Record<string, GameState> = {}

export function createOrRetrieveGame(roomId: string, io: Server) {
  if (isDefined(games[roomId])) {
    return io.to(roomId).emit('gameState', games[roomId])
  }

  const newGame = new GameState(1, GameState.initialBoard(), [], [], undefined)
  games[roomId] = newGame
  io.to(roomId).emit('gameState', newGame)
}

export function gameHandlers(socket: Socket, io: Server) {
  passTurnHandler(socket, games, io)
  movePawnHandler(socket, games, io)
  killPawnHandler(socket, games, io)
  pushPawnHandler(socket, games, io)
  pullPawnHandler(socket, games, io)
  rotatePawnHandler(socket, games, io)
}
