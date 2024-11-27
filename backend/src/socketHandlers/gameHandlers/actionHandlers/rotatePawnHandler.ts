import PawnDto from '../../../../shared/pawn/entities/PawnDto'
import { PlayerRole } from '../../../../shared/gameState/entities/PlayerRoleEnum'
import { Orientation } from '../../../../shared/pawn/entities/OrientationEnum'
import { Server, Socket } from 'socket.io'
import { Callback } from '../../socketHandlers'
import { checkIfGameExistAndIfIsPlayerTurn, checkIfIsPawnOwner } from '../../utils/game/gameChecks'
import pawnDtoToEntity from '../../../../shared/pawn/mappers/pawnMapper'
import { Action } from '../../../../shared/pawn/entities/ActionEnum'
import { games } from '../record/gameRecords'

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
  )
}
