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

export default function pushPawnHandler(
  socket: Socket,
  games: Record<string, GameState>,
  io: Server
) {
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
