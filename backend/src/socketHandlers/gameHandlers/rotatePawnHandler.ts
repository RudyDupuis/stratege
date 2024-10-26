import GameState from '../../../shared/gameState/entities/GameState'
import PawnDto from '../../../shared/pawn/entities/PawnDto'
import { Player } from '../../../shared/gameState/entities/PlayerEnum'
import { Orientation } from '../../../shared/pawn/entities/OrientationEnum'
import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import { checkIfGameExistAndIfIsPlayerTurn, checkIfIsPawnOwner } from '../../utils/gameChecks'
import pawnDtoToEntity from '../../../shared/pawn/mappers/pawnMapper'
import { Action } from '../../../shared/pawn/entities/ActionEnum'

export default function rotatePawnHandler(
  socket: Socket,
  games: Record<string, GameState>,
  io: Server
) {
  socket.on(
    'rotatePawn',
    (
      roomId: string,
      player: Player,
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
