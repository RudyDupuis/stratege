import GameState from '../../../shared/gameState/entities/GameState'
import PawnDto from '../../../shared/pawn/entities/PawnDto'
import PawnPositionDto from '../../../shared/pawnPosition/entities/PawnPositionDto'
import { PlayerRole } from '../../../shared/gameState/entities/PlayerRoleEnum'
import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import {
  checkIfGameExistAndIfIsPlayerTurn,
  checkIfIsPawnOwner,
  checkPawnPositionsAvailable
} from '../../utils/gameChecks'
import { calculatePawnRemainingMoves } from '../../utils/gameMethods'
import pawnDtoToEntity from '../../../shared/pawn/mappers/pawnMapper'
import pawnPositionDtoToEntity from '../../../shared/pawnPosition/mappers/pawnPositionMapper'
import { Action } from '../../../shared/pawn/entities/ActionEnum'
import PawnPosition from '../../../shared/pawnPosition/entities/PawnPosition'

export default function movePawnHandler(
  socket: Socket,
  games: Record<string, GameState>,
  io: Server
) {
  socket.on(
    'movePawn',
    (
      roomId: string,
      player: PlayerRole,
      pawnDto: PawnDto,
      desiredPawnPositionDto: PawnPositionDto,
      callback: Callback
    ) => {
      const gameState = games[roomId]
      const pawn = pawnDtoToEntity(pawnDto)
      const desiredPawnPosition = pawnPositionDtoToEntity(desiredPawnPositionDto)

      try {
        checkIfGameExistAndIfIsPlayerTurn(gameState, player)
        checkIfIsPawnOwner(gameState, pawn, player)
      } catch (error) {
        return callback({ error: error })
      }

      const positionsAvailableForMoving = gameState.determineAvailablePositionsForActions(
        pawn,
        player
      ).positionsAvailableForMoving

      try {
        checkPawnPositionsAvailable(positionsAvailableForMoving, desiredPawnPosition)
      } catch (error) {
        return callback({ error: error })
      }

      calculatePawnRemainingMoves(pawn, desiredPawnPosition)

      pawn.lastPosition = new PawnPosition(pawn.position.row, pawn.position.col)
      pawn.position = desiredPawnPosition
      pawn.lastAction = Action.Move

      gameState.updatePawn(pawn)
      gameState.updateBoard()

      io.to(roomId).emit('gameState', gameState)
    }
  )
}
