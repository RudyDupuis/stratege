import { GameState } from '@shared/entities/GameState'
import { Server, Socket } from 'socket.io'
import passTurnHandler from './passTurnHandler'
import movePawnHandler from './movePawnHandler'
import killPawnHandler from './killPawnHandler'
import pushPawnHandler from './pushPawnHandler'
import pullPawnHandler from './pullPawnHandler'
import rotatePawnHandler from './rotatePawnHandler'

const games: Record<string, GameState> = {}

export function createGame(roomId: string, io: Server) {
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
