import GameState from '../../../shared/gameState/entities/GameState'
import PawnDto from '../../../shared/pawn/entities/PawnDto'
import PawnPosition from '../../../shared/pawnPosition/entities/PawnPosition'
import PawnPositionDto from '../../../shared/pawnPosition/entities/PawnPositionDto'
import { Player } from '../../../shared/gameState/entities/PlayerEnum'
import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import {
  checkIfGameExistAndIfIsPlayerTurn,
  checkIfPawnExistAndIfIsPawnOwner,
  checkPawnPositionOnGameBoard,
  checkPawnPositionsAvailable
} from '../../utils/gameChecks'
import { calculatePawnRemainingMoves } from '../../utils/gameMethods'
import { isUndefined } from '../../../shared/utils/TypeGuard'
import pawnDtoToEntity from '../../../shared/pawn/mappers/pawnMapper'
import pawnPositionDtoToEntity from '../../../shared/pawnPosition/mappers/pawnPositionMapper'

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
      pawnDto: PawnDto,
      desiredPushedPawnPositionDto: PawnPositionDto,
      callback: Callback
    ) => {
      const game = games[roomId]
      const pawn = pawnDtoToEntity(pawnDto)
      const desiredPushedPawnPosition = pawnPositionDtoToEntity(desiredPushedPawnPositionDto)

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

      let pawnToPushPosition: PawnPosition | undefined = undefined

      if (maxCol - minCol > 0) {
        pawnToPushPosition = new PawnPosition(minRow, minCol + 1)
      }
      if (maxRow - minRow > 0) {
        pawnToPushPosition = new PawnPosition(minRow + 1, minCol)
      }

      if (isUndefined(pawnToPushPosition)) {
        console.error(
          'Le pion ne peut pas aller dans cette direction' +
            JSON.stringify(pawn) +
            ' ' +
            JSON.stringify(pawnToPushPosition)
        )
        throw new Error('Le pion ne peut pas aller dans cette direction')
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
