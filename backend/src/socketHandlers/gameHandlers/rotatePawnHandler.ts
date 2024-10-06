import { GameState } from '../../../shared/entities/GameState'
import { PawnDto } from '../../../shared/entities/Pawn'
import { Orientation, Player } from '../../../shared/Enum'
import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import {
  checkIfGameExistAndIfIsPlayerTurn,
  checkIfPawnExistAndIfIsPawnOwner
} from '../../helpers/gameChecks'
import { pawnDtoToEntity } from '../../../shared/helpers/Mapper'

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
