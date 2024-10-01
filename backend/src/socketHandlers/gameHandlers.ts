import { GameState } from '@shared/entities/GameState'
import { Server, Socket } from 'socket.io'
import { Callback } from '.'
import { Pawn } from '@shared/entities/Pawn'
import { PawnPosition } from '@shared/entities/PawnPosition'
import {
  checkIfGameExistAndIfIsPlayerTurn,
  checkIfPawnExistAndIfIsPawnOwner,
  checkPawnMovements,
  checkPawnPositionOnGameBoard
} from '@/helpers/gameChecks'

const games: Record<string, GameState> = {}

function calculatePawnRemainingMoves(
  currentPawnPosition: PawnPosition,
  desiredPawnPosition: PawnPosition,
  instancedPawn: Pawn
) {
  const moveDistance =
    Math.abs(currentPawnPosition.row - desiredPawnPosition.row) +
    Math.abs(currentPawnPosition.col - desiredPawnPosition.col)

  instancedPawn.remainingMove -= moveDistance
}

export function createGame(roomId: string, io: Server) {
  const newGame = new GameState(1, GameState.initialBoard(), [], [], undefined)
  games[roomId] = newGame
  io.to(roomId).emit('gameState', newGame)
}

export function passTurn(socket: Socket, io: Server) {
  socket.on('passTurn', (roomId: string, player: 'player1' | 'player2', callback: Callback) => {
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

export function movePawn(socket: Socket, io: Server) {
  socket.on(
    'movePawn',
    (
      roomId: string,
      player: 'player1' | 'player2',
      pawn: Pawn,
      desiredPawnPosition: PawnPosition,
      callback: Callback
    ) => {
      const game = games[roomId]

      try {
        checkIfGameExistAndIfIsPlayerTurn(game, player)
        checkIfPawnExistAndIfIsPawnOwner(game, pawn, player)
        checkPawnPositionOnGameBoard(game, pawn)
      } catch (error) {
        return callback({ error: error })
      }

      const instancedPawn = game.findPawn(pawn)
      const currentPawnPosition = game.calculatePawnPosition(pawn)
      const availableMoves = game.calculateAvailableMovesAndKills(pawn, player).availableMoves

      try {
        checkPawnMovements(availableMoves, desiredPawnPosition)
      } catch (error) {
        return callback({ error: error })
      }

      calculatePawnRemainingMoves(currentPawnPosition, desiredPawnPosition, instancedPawn)

      game.board[currentPawnPosition.row][currentPawnPosition.col] = null
      game.board[desiredPawnPosition.row][desiredPawnPosition.col] = instancedPawn

      io.to(roomId).emit('gameState', game)
    }
  )
}

export function killPawn(socket: Socket, io: Server) {
  socket.on(
    'killPawn',
    (
      roomId: string,
      player: 'player1' | 'player2',
      pawn: Pawn,
      desiredPawnPosition: PawnPosition,
      callback: Callback
    ) => {
      const game = games[roomId]

      try {
        checkIfGameExistAndIfIsPlayerTurn(game, player)
        checkIfPawnExistAndIfIsPawnOwner(game, pawn, player)
        checkPawnPositionOnGameBoard(game, pawn)
      } catch (error) {
        return callback({ error: error })
      }

      const instancedPawn = game.findPawn(pawn)

      const currentPawnPosition = game.calculatePawnPosition(pawn)
      const availableKills = game.calculateAvailableMovesAndKills(pawn, player).availableKills

      try {
        checkPawnMovements(availableKills, desiredPawnPosition)
        game.findPawnByPosition(desiredPawnPosition)
      } catch (error) {
        return callback({ error: error })
      }

      const pawnToKill = game.findPawnByPosition(desiredPawnPosition)

      if (pawnToKill.owner === player) {
        return callback({ error: 'Le pion à prendre appartient au même joueur' })
      }

      calculatePawnRemainingMoves(currentPawnPosition, desiredPawnPosition, instancedPawn)

      if (player === 'player1') {
        game.player2sLostPawns.push(pawnToKill)
      }
      if (player === 'player2') {
        game.player1sLostPawns.push(pawnToKill)
      }

      game.board[currentPawnPosition.row][currentPawnPosition.col] = null
      game.board[desiredPawnPosition.row][desiredPawnPosition.col] = instancedPawn

      game.determineWinner()
      io.to(roomId).emit('gameState', game)
    }
  )
}

export function rotatePawn(socket: Socket, io: Server) {
  socket.on(
    'rotatePawn',
    (
      roomId: string,
      player: 'player1' | 'player2',
      pawn: Pawn,
      orientation: 'NW' | 'SE' | 'NE' | 'SW',
      callback: Callback
    ) => {
      const game = games[roomId]

      try {
        checkIfGameExistAndIfIsPlayerTurn(game, player)
        checkIfPawnExistAndIfIsPawnOwner(game, pawn, player)
      } catch (error) {
        return callback({ error: error })
      }

      const instancedPawn = game.findPawn(pawn)

      instancedPawn.orientation = orientation

      io.to(roomId).emit('gameState', game)
    }
  )
}
