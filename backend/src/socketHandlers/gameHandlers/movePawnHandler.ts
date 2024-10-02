import { GameState } from '@shared/entities/GameState'
import { Pawn } from '@shared/entities/Pawn'
import { PawnPosition } from '@shared/entities/PawnPosition'
import { Player } from '@shared/Enum'
import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import {
  checkIfGameExistAndIfIsPlayerTurn,
  checkIfPawnExistAndIfIsPawnOwner,
  checkPawnPositionOnGameBoard,
  checkPawnPositionsAvailable
} from '@/helpers/gameChecks'
import { calculatePawnRemainingMoves } from '@/helpers/gameMethods'

export default function movePawnHandler(
  socket: Socket,
  games: Record<string, GameState>,
  io: Server
) {
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
