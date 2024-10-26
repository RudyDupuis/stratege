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
import pawnDtoToEntity from '../../../shared/pawn/mappers/pawnMapper'
import pawnPositionDtoToEntity from '../../../shared/pawnPosition/mappers/pawnPositionMapper'

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
      pawnDto: PawnDto,
      desiredPawnPositionAfterPullingDto: PawnPositionDto,
      callback: Callback
    ) => {
      const game = games[roomId]
      const pawn = pawnDtoToEntity(pawnDto)
      const desiredPawnPositionAfterPulling = pawnPositionDtoToEntity(
        desiredPawnPositionAfterPullingDto
      )

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
