import { GameState } from '@shared/entities/GameState'
import { Server, Socket } from 'socket.io'
import { Callback } from '.'
import { Pawn } from '@shared/entities/Pawn'
import { PawnPosition } from '@shared/entities/PawnPosition'
import { isUndefined } from '@shared/helpers/TypeGuard'

const games: Record<string, GameState> = {}

export function createGame(roomId: string, io: Server) {
  const newGame = new GameState(1, GameState.initialBoard())
  games[roomId] = newGame
  io.to(roomId).emit('gameState', newGame)
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
      if (isUndefined(game)) {
        return callback({ error: "L'état de la partie est introuvable" })
      }

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

      console.log(
        `Déplacement d'un pion dans la room: ${roomId}. Pion: ${pawn.id}. Position: (col:${pawnPosition.col},row:${pawnPosition.row}). Tour: ${game.turn}`
      )
      game.board[currentPawnPosition.row][currentPawnPosition.col] = null
      game.board[pawnPosition.row][pawnPosition.col] = pawn
      game.turn = game.turn + 1

      io.to(roomId).emit('gameState', game)
      callback(null)
    }
  )
}
