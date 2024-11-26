import GameState from '../../../shared/gameState/entities/GameState'
import { Server, Socket } from 'socket.io'
import movePawnHandler from './movePawnHandler'
import killPawnHandler from './killPawnHandler'
import pushPawnHandler from './pushPawnHandler'
import pullPawnHandler from './pullPawnHandler'
import rotatePawnHandler from './rotatePawnHandler'
import { isDefined } from '../../../shared/utils/TypeGuard'
import initialBoardPawns from '../../../shared/gameState/utils/initialBoardPawns'
import giveUpHandler from './giveUpHandler'
import { passTurnHandler, setTurnTimer } from './passTurnHandler'

const games: Record<string, GameState> = {}
const gameTurnTimers: Record<string, NodeJS.Timeout> = {}

export function createOrRetrieveGame(roomId: string, io: Server) {
  if (isDefined(games[roomId])) {
    return io.to(roomId).emit('gameState', games[roomId])
  }

  const newGame = new GameState(1, initialBoardPawns())

  games[roomId] = newGame
  io.to(roomId).emit('gameState', newGame)

  setTurnTimer(newGame, games, gameTurnTimers, roomId, io)
}

export function gameHandlers(socket: Socket, io: Server) {
  passTurnHandler(socket, games, gameTurnTimers, io)
  movePawnHandler(socket, games, io)
  killPawnHandler(socket, games, gameTurnTimers, io)
  pushPawnHandler(socket, games, io)
  pullPawnHandler(socket, games, io)
  rotatePawnHandler(socket, games, io)
  giveUpHandler(socket, games, gameTurnTimers, io)
}
