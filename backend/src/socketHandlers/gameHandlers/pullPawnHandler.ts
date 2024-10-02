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

export default function pullPawnHandler(
  socket: Socket,
  games: Record<string, GameState>,
  io: Server
) {
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
