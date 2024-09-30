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

  if (game.determinesPayerBasedOnTurn() !== player) {
    return callback({ error: "Ce n'est pas le tour de ce joueur" })
  }
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
      pawnPosition: PawnPosition,
      callback: Callback
    ) => {
      const game = games[roomId]
      checkGameAndPlayerTurn(game, player, callback)

      if (pawn.owner !== player) {
        return callback({ error: "Le pion n'appartient pas au bon joueur" })
      }

      let currentPawnPosition: PawnPosition | undefined = undefined
      try {
        currentPawnPosition = game.calculatePawnPosition(pawn)
      } catch (error) {
        return callback({ error: error })
      }

      const availableMoves = game.calculateAvailableMoves(pawn)
      if (availableMoves.length === 0) {
        return callback({ error: 'Le pion ne peut pas bouger' })
      }

      if (
        !availableMoves.some((pos) => pos.row === pawnPosition.row && pos.col === pawnPosition.col)
      ) {
        return callback({ error: 'Le pion ne peut pas aller dans cette direction' })
      }

      const moveDistance =
        Math.abs(currentPawnPosition.row - pawnPosition.row) +
        Math.abs(currentPawnPosition.col - pawnPosition.col)

      console.log(
        `Déplacement d'un pion dans la room: ${roomId}. Pion: ${pawn.id}. Position: (col:${pawnPosition.col},row:${pawnPosition.row}). Tour: ${game.turn}. Distance: ${moveDistance}`
      )

      pawn.remainingMove -= moveDistance
      game.board[currentPawnPosition.row][currentPawnPosition.col] = null
      game.board[pawnPosition.row][pawnPosition.col] = pawn

      io.to(roomId).emit('gameState', game)
      callback(null)
    }
  )
}
