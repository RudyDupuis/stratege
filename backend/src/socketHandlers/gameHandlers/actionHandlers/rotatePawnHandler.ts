import PawnDto from '../../../../shared/pawn/entities/PawnDto'
import { PlayerRole } from '../../../../shared/gameState/entities/PlayerRoleEnum'
import { Orientation } from '../../../../shared/pawn/entities/OrientationEnum'
import { Server, Socket } from 'socket.io'
import { Callback } from '../../socketHandlers'
import { checkIfGameExistAndIfIsPlayerTurn, checkIfIsPawnOwner } from '../../utils/game/gameChecks'
import pawnDtoToEntity from '../../../../shared/pawn/mappers/pawnMapper'
import { Action } from '../../../../shared/pawn/entities/ActionEnum'
import { games } from '../record/gameRecords'
import GameState from '../../../../shared/gameState/entities/GameState'
import Pawn from '../../../../shared/pawn/entities/Pawn'

export default function rotatePawnHandler(socket: Socket, io: Server) {
  socket.on(
    'rotatePawn',
    (
      roomId: string,
      player: PlayerRole,
      pawnDto: PawnDto,
      orientation: Orientation,
      callback: Callback
    ) => {
      const gameState = games[roomId]
      const pawn = pawnDtoToEntity(pawnDto)

      rotatePawn(gameState, roomId, player, pawn, orientation, io, callback)
    }
  )
}

export function rotatePawn(
  gameState: GameState,
  roomId: string,
  player: PlayerRole,
  pawn: Pawn,
  orientation: Orientation,
  io: Server,
  callback: Callback
) {
  try {
    checkIfGameExistAndIfIsPlayerTurn(gameState, player)
    checkIfIsPawnOwner(gameState, pawn, player)
  } catch (error) {
    return callback({ error: error })
  }

  pawn.orientation = orientation
  pawn.lastAction = Action.Rotate

  gameState.updatePawn(pawn)

  io.to(roomId).emit('gameState', gameState)
}
