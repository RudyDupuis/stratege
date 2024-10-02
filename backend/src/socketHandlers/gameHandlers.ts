import { GameState } from '@shared/entities/GameState'
import { Server, Socket } from 'socket.io'
import { Callback } from '.'
import { Pawn } from '@shared/entities/Pawn'
import { PawnPosition } from '@shared/entities/PawnPosition'
import {
  checkIfGameExistAndIfIsPlayerTurn,
  checkIfPawnExistAndIfIsPawnOwner,
  checkPawnPositionsAvailable,
  checkPawnPositionOnGameBoard
} from '@/helpers/gameChecks'
import { Orientation, Player } from '@shared/Enum'

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

export function movePawn(socket: Socket, io: Server) {
  socket.on(
    'movePawn',
    (
      roomId: string,
      player: Player,
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
      const positionsAvailableForMoving =
        game.calculatePositionsAvailableForMovingKillingPushingOrPulling(
          pawn,
          player
        ).returnedPositionsAvailableForMoving

      try {
        checkPawnPositionsAvailable(positionsAvailableForMoving, desiredPawnPosition)
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
      player: Player,
      pawn: Pawn,
      desiredPawnPositionForKill: PawnPosition,
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
      const positionsAvailableForKilling =
        game.calculatePositionsAvailableForMovingKillingPushingOrPulling(
          pawn,
          player
        ).returnedPositionsAvailableForKilling

      try {
        checkPawnPositionsAvailable(positionsAvailableForKilling, desiredPawnPositionForKill)
        game.findPawnByPosition(desiredPawnPositionForKill)
      } catch (error) {
        return callback({ error: error })
      }

      const pawnToKill = game.findPawnByPosition(desiredPawnPositionForKill)

      if (pawnToKill.owner === player) {
        return callback({ error: 'Le pion à prendre appartient au même joueur' })
      }

      calculatePawnRemainingMoves(currentPawnPosition, desiredPawnPositionForKill, instancedPawn)

      if (player === Player.Player1) {
        game.player2sLostPawns.push(pawnToKill)
      }
      if (player === Player.Player2) {
        game.player1sLostPawns.push(pawnToKill)
      }

      game.board[currentPawnPosition.row][currentPawnPosition.col] = null
      game.board[desiredPawnPositionForKill.row][desiredPawnPositionForKill.col] = instancedPawn

      game.determineWinner()
      io.to(roomId).emit('gameState', game)
    }
  )
}

export function pushPawn(socket: Socket, io: Server) {
  socket.on(
    'pushPawn',
    (
      roomId: string,
      player: Player,
      pawn: Pawn,
      desiredPushedPawnPosition: PawnPosition,
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
      const positionsAvailableForPushing =
        game.calculatePositionsAvailableForMovingKillingPushingOrPulling(
          pawn,
          player
        ).returnedPositionsAvailableForPushing

      try {
        checkPawnPositionsAvailable(positionsAvailableForPushing, desiredPushedPawnPosition)
      } catch (error) {
        return callback({ error: error })
      }

      //Is used to calculate the position of the pion to push
      const minCol = Math.min(currentPawnPosition.col, desiredPushedPawnPosition.col)
      const maxCol = Math.max(currentPawnPosition.col, desiredPushedPawnPosition.col)
      const minRow = Math.min(currentPawnPosition.row, desiredPushedPawnPosition.row)
      const maxRow = Math.max(currentPawnPosition.row, desiredPushedPawnPosition.row)

      let pawnToPushPosition: PawnPosition

      if (maxCol - minCol > 0) {
        pawnToPushPosition = new PawnPosition(minRow, minCol + 1)
      }
      if (maxRow - minRow > 0) {
        pawnToPushPosition = new PawnPosition(minRow + 1, minCol)
      }

      const pawnToPush = game.findPawnByPosition(pawnToPushPosition)

      calculatePawnRemainingMoves(currentPawnPosition, pawnToPushPosition, instancedPawn)

      game.board[currentPawnPosition.row][currentPawnPosition.col] = null
      game.board[pawnToPushPosition.row][pawnToPushPosition.col] = instancedPawn
      game.board[desiredPushedPawnPosition.row][desiredPushedPawnPosition.col] = pawnToPush

      io.to(roomId).emit('gameState', game)
    }
  )
}

export function pullPawn(socket: Socket, io: Server) {
  socket.on(
    'pullPawn',
    (
      roomId: string,
      player: Player,
      pawn: Pawn,
      desiredPawnPositionAfterPulling: PawnPosition,
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
      const positionsAvailableForPulling =
        game.calculatePositionsAvailableForMovingKillingPushingOrPulling(
          pawn,
          player
        ).returnedPositionsAvailableForPulling

      try {
        checkPawnPositionsAvailable(positionsAvailableForPulling, desiredPawnPositionAfterPulling)
      } catch (error) {
        return callback({ error: error })
      }

      const pawnToPullPosition = new PawnPosition(
        currentPawnPosition.row + currentPawnPosition.row - desiredPawnPositionAfterPulling.row,
        currentPawnPosition.col + currentPawnPosition.col - desiredPawnPositionAfterPulling.col
      )

      const pawnToPull = game.findPawnByPosition(pawnToPullPosition)

      calculatePawnRemainingMoves(
        currentPawnPosition,
        desiredPawnPositionAfterPulling,
        instancedPawn
      )

      game.board[desiredPawnPositionAfterPulling.row][desiredPawnPositionAfterPulling.col] =
        instancedPawn
      game.board[currentPawnPosition.row][currentPawnPosition.col] = pawnToPull
      game.board[pawnToPullPosition.row][pawnToPullPosition.col] = null

      io.to(roomId).emit('gameState', game)
    }
  )
}

export function rotatePawn(socket: Socket, io: Server) {
  socket.on(
    'rotatePawn',
    (roomId: string, player: Player, pawn: Pawn, orientation: Orientation, callback: Callback) => {
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
