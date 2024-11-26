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
import { Callback } from '../socketHandlers'
import { PlayerRole } from '../../../shared/gameState/entities/PlayerRoleEnum'
import winnerHandler from './winnerHandler'

const games: Record<string, GameState> = {}
const gameTurnTimers: Record<string, NodeJS.Timeout> = {}
const gameGiveUpTimers: Record<string, NodeJS.Timeout> = {}

export function createOrRetrieveGame(roomId: string, io: Server, callback: Callback) {
  if (isDefined(games[roomId])) {
    if (isDefined(games[roomId].winner)) {
      return callback({ error: 'La partie est finie' })
    }

    clearTimeout(gameGiveUpTimers[roomId])
    return io.to(roomId).emit('gameState', games[roomId])
  }

  const newGame = new GameState(1, initialBoardPawns())

  games[roomId] = newGame
  io.to(roomId).emit('gameState', newGame)
  setTurnTimer(newGame, games, gameTurnTimers, roomId, io)
}

export function setGameGiveUpTimer(roomId: string, disconnectedPlayerRole: PlayerRole, io: Server) {
  const gameState = games[roomId]

  let remainingTime = GameState.GIVE_UP_TIME_SECONDS

  gameGiveUpTimers[roomId] = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime -= 1
      io.to(roomId).emit('gameGiveUpRemainingTime', remainingTime)
    }
    if (remainingTime === 0) {
      clearTimeout(gameGiveUpTimers[roomId])
      delete gameGiveUpTimers[roomId]

      gameState.winner =
        disconnectedPlayerRole === PlayerRole.Player1 ? PlayerRole.Player2 : PlayerRole.Player1
      winnerHandler(gameState, gameTurnTimers, roomId, io, () => {})
    }
  }, 1000)
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
