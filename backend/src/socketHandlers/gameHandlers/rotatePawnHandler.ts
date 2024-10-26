import GameState from '../../../shared/gameState/entities/GameState'
import PawnDto from '../../../shared/pawn/entities/PawnDto'
import { Player } from '../../../shared/gameState/entities/PlayerEnum'
import { Orientation } from '../../../shared/pawn/entities/OrientationEnum'
import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import {
  checkIfGameExistAndIfIsPlayerTurn,
  checkIfPawnExistAndIfIsPawnOwner
} from '../../utils/gameChecks'
import pawnDtoToEntity from '../../../shared/pawn/mappers/pawnMapper'

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
      const game = games[roomId]
      const pawn = pawnDtoToEntity(pawnDto)

      try {
        checkIfGameExistAndIfIsPlayerTurn(game, player)
        checkIfPawnExistAndIfIsPawnOwner(game, pawn, player)
      } catch (error) {
        return callback({ error: error })
      }

      const instancedPawn = game.findPawn(pawn)

      instancedPawn.orientation = orientation

      io.to(roomId).emit('gameState', game)
    }
  )
}
