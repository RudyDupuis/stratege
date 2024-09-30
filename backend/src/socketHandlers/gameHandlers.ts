import { GameState } from '@shared/entities/GameState'
import { Server, Socket } from 'socket.io'
import { Callback } from '.'
import { Pawn } from '@shared/entities/Pawn'
import { PawnPosition } from '@shared/entities/PawnPosition'
import { isUndefined } from '@shared/helpers/TypeGuard'

const games: Record<string, GameState> = {}

function checkGameAndPlayerTurn(
  game: GameState,
  player: 'player1' | 'player2',
  callback: Callback
) {
  if (isUndefined(game)) {
    return callback({ error: "L'état de la partie est introuvable" })
  }

  if (game.determinesPlayerBasedOnTurn() !== player) {
    return callback({ error: "Ce n'est pas le tour de ce joueur" })
  }
}

function checkPawnExistAndPawnOwner(
  game: GameState,
  pawn: Pawn,
  player: 'player1' | 'player2',
  callback: Callback
) {
  try {
    game.findPawn(pawn)
  } catch (error) {
    return callback({ error: error })
  }

  if (pawn.owner !== player) {
    return callback({ error: "Le pion n'appartient pas au bon joueur" })
  }
}

function checkPawnPosition(game: GameState, pawn: Pawn, callback: Callback) {
  try {
    game.calculatePawnPosition(pawn)
  } catch (error) {
    return callback({ error: error })
  }
}

function checkPawnMovement(
  availablePawnMovement: PawnPosition[],
  pawnPosition: PawnPosition,
  callback: Callback
) {
  if (availablePawnMovement.length === 0) {
    return callback({ error: 'Le pion ne peut pas bouger' })
  }

  if (
    !availablePawnMovement.some(
      (pos) => pos.row === pawnPosition.row && pos.col === pawnPosition.col
    )
  ) {
    return callback({ error: 'Le pion ne peut pas aller dans cette direction' })
  }
}

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
  const newGame = new GameState(1, GameState.initialBoard())
  games[roomId] = newGame
  io.to(roomId).emit('gameState', newGame)
}

export function passTurn(socket: Socket, io: Server) {
  socket.on('passTurn', (roomId: string, player: 'player1' | 'player2', callback: Callback) => {
    const game = games[roomId]
    checkGameAndPlayerTurn(game, player, callback)

    console.log(`Joueur ${player === 'player1' ? '1' : '2'} passe son tour`)
    game.turn += 1
    game.resetRemainingMoves()

    io.to(roomId).emit('gameState', game)
    callback(null)
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
      checkGameAndPlayerTurn(game, player, callback)
      checkPawnExistAndPawnOwner(game, pawn, player, callback)

      const instancedPawn = game.findPawn(pawn)

      checkPawnPosition(game, pawn, callback)

      const currentPawnPosition = game.calculatePawnPosition(pawn)
      const availableMoves = game.calculateAvailableMovesAndKills(pawn, player).availableMoves

      checkPawnMovement(availableMoves, desiredPawnPosition, callback)

      calculatePawnRemainingMoves(currentPawnPosition, desiredPawnPosition, instancedPawn)
      console.log(
        `Déplacement d'un pion dans la room: ${roomId}. Pion: ${pawn.id}. Position: (col:${desiredPawnPosition.col},row:${desiredPawnPosition.row}). Tour: ${game.turn}.`
      )

      game.board[currentPawnPosition.row][currentPawnPosition.col] = null
      game.board[desiredPawnPosition.row][desiredPawnPosition.col] = instancedPawn

      io.to(roomId).emit('gameState', game)
      callback(null)
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
      checkGameAndPlayerTurn(game, player, callback)
      checkPawnExistAndPawnOwner(game, pawn, player, callback)

      const instancedPawn = game.findPawn(pawn)

      checkPawnPosition(game, pawn, callback)

      const currentPawnPosition = game.calculatePawnPosition(pawn)
      const availableKills = game.calculateAvailableMovesAndKills(pawn, player).availableKills

      checkPawnMovement(availableKills, desiredPawnPosition, callback)

      try {
        game.findPawnByPosition(desiredPawnPosition)
      } catch (error) {
        return callback({ error: error })
      }

      const pawnToKill = game.findPawnByPosition(desiredPawnPosition)

      if (pawnToKill.owner === player) {
        return callback({ error: 'Le pion à prendre appartient au même joueur' })
      }

      calculatePawnRemainingMoves(currentPawnPosition, desiredPawnPosition, instancedPawn)

      console.log(
        `Élimination d'un pion dans la room: ${roomId}. Pion: ${pawn.id}. Pion prit: ${pawnToKill.id}. Position: (col:${desiredPawnPosition.col},row:${desiredPawnPosition.row}). Tour: ${game.turn}.`
      )

      game.board[currentPawnPosition.row][currentPawnPosition.col] = null
      game.board[desiredPawnPosition.row][desiredPawnPosition.col] = instancedPawn

      io.to(roomId).emit('gameState', game)
      callback(null)
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
      checkGameAndPlayerTurn(game, player, callback)
      checkPawnExistAndPawnOwner(game, pawn, player, callback)

      const instancedPawn = game.findPawn(pawn)

      console.log(`Rotation d'un pion en direction: ${orientation} dans la room: ${roomId}.`)
      instancedPawn.orientation = orientation

      io.to(roomId).emit('gameState', game)
      callback(null)
    }
  )
}
