import PawnDto from '../../../../shared/pawn/entities/PawnDto'
import PawnPosition from '../../../../shared/pawnPosition/entities/PawnPosition'
import PawnPositionDto from '../../../../shared/pawnPosition/entities/PawnPositionDto'
import { PlayerRole } from '../../../../shared/gameState/entities/PlayerRoleEnum'
import { Server, Socket } from 'socket.io'
import { Callback } from '../../socketHandlers'
import {
  checkIfGameExistAndIfIsPlayerTurn,
  checkIfIsPawnOwner,
  checkPawnPositionsAvailable
} from '../../utils/game/gameChecks'
import calculatePawnRemainingMoves from '../../utils/game/calculatePawnRemainingMoves'
import pawnDtoToEntity from '../../../../shared/pawn/mappers/pawnMapper'
import pawnPositionDtoToEntity from '../../../../shared/pawnPosition/mappers/pawnPositionMapper'
import { isUndefined } from '../../../../shared/utils/TypeGuard'
import { Action, ReceivedAction } from '../../../../shared/pawn/entities/ActionEnum'
import { games } from '../record/gameRecords'
import GameState from '../../../../shared/gameState/entities/GameState'
import Pawn from '../../../../shared/pawn/entities/Pawn'

export default function pullPawnHandler(socket: Socket, io: Server) {
  socket.on(
    'pullPawn',
    (
      roomId: string,
      player: PlayerRole,
      pawnDto: PawnDto,
      desiredPawnPositionAfterPullingDto: PawnPositionDto,
      callback: Callback
    ) => {
      const gameState = games[roomId]
      const pawn = pawnDtoToEntity(pawnDto)
      const desiredPawnPositionAfterPulling = pawnPositionDtoToEntity(
        desiredPawnPositionAfterPullingDto
      )

      pullPawn(gameState, roomId, player, pawn, desiredPawnPositionAfterPulling, io, callback)
    }
  )
}

export function pullPawn(
  gameState: GameState,
  roomId: string,
  player: PlayerRole,
  pawn: Pawn,
  desiredPawnPositionAfterPulling: PawnPosition,
  io: Server,
  callback: Callback
) {
  try {
    checkIfGameExistAndIfIsPlayerTurn(gameState, player)
    checkIfIsPawnOwner(gameState, pawn, player)
  } catch (error) {
    return callback({ error: error })
  }

  const positionsAvailableForPulling = gameState.determineAvailablePositionsForActions(
    pawn,
    player
  ).positionsAvailableForPulling

  try {
    checkPawnPositionsAvailable(positionsAvailableForPulling, desiredPawnPositionAfterPulling)
  } catch (error) {
    return callback({ error: error })
  }

  const pawnToPullPosition = new PawnPosition(
    pawn.position.row + pawn.position.row - desiredPawnPositionAfterPulling.row,
    pawn.position.col + pawn.position.col - desiredPawnPositionAfterPulling.col
  )

  const pawnToPull = gameState.findPawnByPosition(pawnToPullPosition)

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
