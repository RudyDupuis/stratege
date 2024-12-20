import PawnDto from '../../../../shared/pawn/entities/PawnDto'
import PawnPositionDto from '../../../../shared/pawnPosition/entities/PawnPositionDto'
import { PlayerRole } from '../../../../shared/gameState/entities/PlayerRoleEnum'
import { Server, Socket } from 'socket.io'
import { Callback } from '../../socketHandlers'
import {
  checkIfGameExistAndIfIsPlayerTurn,
  checkIfIsPawnOwner,
  checkPawnPositionsAvailable
} from '../../utils/game/gameChecks'
import pawnDtoToEntity from '../../../../shared/pawn/mappers/pawnMapper'
import pawnPositionDtoToEntity from '../../../../shared/pawnPosition/mappers/pawnPositionMapper'
import { isUndefined } from '../../../../shared/utils/TypeGuard'
import { Action, ReceivedAction } from '../../../../shared/pawn/entities/ActionEnum'
import PawnPosition from '../../../../shared/pawnPosition/entities/PawnPosition'
import { games } from '../record/gameRecords'
import endGameHandler from '../../../socketHandlers/utils/game/endGameHandler'
import calculatePawnRemainingMoves from '../../utils/game/calculatePawnRemainingMoves'
import GameState from '../../../../shared/gameState/entities/GameState'
import Pawn from '../../../../shared/pawn/entities/Pawn'

export default function killPawnHandler(socket: Socket, io: Server) {
  socket.on(
    'killPawn',
    (
      roomId: string,
      player: PlayerRole,
      pawnDto: PawnDto,
      desiredPawnPositionForKillDto: PawnPositionDto,
      callback: Callback
    ) => {
      const gameState = games[roomId]
      const pawn = pawnDtoToEntity(pawnDto)
      const desiredPawnPositionForKill = pawnPositionDtoToEntity(desiredPawnPositionForKillDto)

      killPawn(gameState, roomId, player, pawn, desiredPawnPositionForKill, io, callback)
    }
  )
}

export function killPawn(
  gameState: GameState,
  roomId: string,
  player: PlayerRole,
  pawn: Pawn,
  desiredPawnPositionForKill: PawnPosition,
  io: Server,
  callback: Callback
) {
  try {
    checkIfGameExistAndIfIsPlayerTurn(gameState, player)
    checkIfIsPawnOwner(gameState, pawn, player)
  } catch (error) {
    return callback({ error: error })
  }

  const positionsAvailableForKilling = gameState.determineAvailablePositionsForActions(
    pawn,
    player
  ).positionsAvailableForKilling

  try {
    checkPawnPositionsAvailable(positionsAvailableForKilling, desiredPawnPositionForKill)
  } catch (error) {
    return callback({ error: error })
  }

  const pawnToKill = gameState.findPawnByPosition(desiredPawnPositionForKill)

  if (isUndefined(pawnToKill)) {
    return callback({ error: "Le pion à prendre n'existe pas" })
  }
  if (pawnToKill.owner === player) {
    return callback({ error: 'Le pion à prendre appartient au même joueur' })
  }
  calculatePawnRemainingMoves(pawn, desiredPawnPositionForKill)

  pawnToKill.isAlive = false
  pawnToKill.lastPosition = new PawnPosition(pawnToKill.position.row, pawnToKill.position.col)
  pawnToKill.position = new PawnPosition(-1, -1)
  pawnToKill.lastAction = ReceivedAction.IsKilled

  pawn.lastPosition = new PawnPosition(pawn.position.row, pawn.position.col)
  pawn.position = desiredPawnPositionForKill
  pawn.lastAction = Action.Kill

  gameState.updatePawn(pawnToKill)
  gameState.updatePawn(pawn)

  gameState.updateBoard()

  io.to(roomId).emit('gameState', gameState)
  endGameHandler(roomId, io, callback)
}
