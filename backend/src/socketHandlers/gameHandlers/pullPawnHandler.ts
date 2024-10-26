import GameState from '../../../shared/gameState/entities/GameState'
import PawnDto from '../../../shared/pawn/entities/PawnDto'
import PawnPosition from '../../../shared/pawnPosition/entities/PawnPosition'
import PawnPositionDto from '../../../shared/pawnPosition/entities/PawnPositionDto'
import { Player } from '../../../shared/gameState/entities/PlayerEnum'
import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import {
  checkIfGameExistAndIfIsPlayerTurn,
  checkIfIsPawnOwner,
  checkPawnPositionsAvailable
} from '../../utils/gameChecks'
import { calculatePawnRemainingMoves, findPawnByPosition } from '../../utils/gameMethods'
import pawnDtoToEntity from '../../../shared/pawn/mappers/pawnMapper'
import pawnPositionDtoToEntity from '../../../shared/pawnPosition/mappers/pawnPositionMapper'
import { isUndefined } from '../../../shared/utils/TypeGuard'
import { Action, ReceivedAction } from '../../../shared/pawn/entities/ActionEnum'

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
      const gameState = games[roomId]
      const pawn = pawnDtoToEntity(pawnDto)
      const desiredPawnPositionAfterPulling = pawnPositionDtoToEntity(
        desiredPawnPositionAfterPullingDto
      )

      try {
        checkIfGameExistAndIfIsPlayerTurn(gameState, player)
        checkIfIsPawnOwner(gameState, pawn, player)
      } catch (error) {
        return callback({ error: error })
      }

      const positionsAvailableForPulling = gameState.determineAvailablePositionsForActions(
        pawn,
        player
      ).returnedPositionsAvailableForPulling

      try {
        checkPawnPositionsAvailable(positionsAvailableForPulling, desiredPawnPositionAfterPulling)
      } catch (error) {
        return callback({ error: error })
      }

      const pawnToPullPosition = new PawnPosition(
        pawn.position.row + pawn.position.row - desiredPawnPositionAfterPulling.row,
        pawn.position.col + pawn.position.col - desiredPawnPositionAfterPulling.col
      )

      const pawnToPull = findPawnByPosition(gameState.boardPawns, pawnToPullPosition)

      if (isUndefined(pawnToPull)) {
        return callback({ error: "Le pion à tirer n'existe pas" })
      }

      calculatePawnRemainingMoves(pawn, desiredPawnPositionAfterPulling)

      pawn.lastPosition = new PawnPosition(pawn.position.row, pawn.position.col)
      pawn.position = desiredPawnPositionAfterPulling
      pawn.lastAction = Action.Pull

      pawnToPull.lastPosition = new PawnPosition(pawnToPull.position.row, pawnToPull.position.col)
      pawnToPull.position = pawn.lastPosition
      pawnToPull.lastAction = ReceivedAction.IsPulled

      gameState.updatePawn(pawn)
      gameState.updatePawn(pawnToPull)

      gameState.updateBoard()

      io.to(roomId).emit('gameState', gameState)
    }
  )
}
