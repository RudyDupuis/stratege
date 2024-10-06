import { GameState } from '../../../shared/entities/GameState'
import { PawnDto } from '../../../shared/entities/Pawn'
import { PawnPositionDto } from '../../../shared/entities/PawnPosition'
import { Player } from '../../../shared/Enum'
import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import {
  checkIfGameExistAndIfIsPlayerTurn,
  checkIfPawnExistAndIfIsPawnOwner,
  checkPawnPositionOnGameBoard,
  checkPawnPositionsAvailable
} from '../../helpers/gameChecks'
import { calculatePawnRemainingMoves } from '../../helpers/gameMethods'
import { pawnDtoToEntity, pawnPositionDtoToEntity } from '../../../shared/helpers/Mapper'

export default function killPawnHandler(
  socket: Socket,
  games: Record<string, GameState>,
  io: Server
) {
  socket.on(
    'killPawn',
    (
      roomId: string,
      player: Player,
      pawnDto: PawnDto,
      desiredPawnPositionForKillDto: PawnPositionDto,
      callback: Callback
    ) => {
      const game = games[roomId]
      const pawn = pawnDtoToEntity(pawnDto)
      const desiredPawnPositionForKill = pawnPositionDtoToEntity(desiredPawnPositionForKillDto)

      try {
        checkIfGameExistAndIfIsPlayerTurn(game, player)
        checkIfPawnExistAndIfIsPawnOwner(game, pawn, player)
        checkPawnPositionOnGameBoard(game, pawn)
      } catch (error) {
        return callback({ error: error })
      }

      const instancedPawn = game.findPawn(pawn)

      const currentPawnPosition = game.calculatePawnPosition(pawn)
      const positionsAvailableForKilling =
        game.calculatePositionsAvailableForMovingKillingPushingOrPulling(
          pawn,
          player
        ).returnedPositionsAvailableForKilling

      try {
        checkPawnPositionsAvailable(positionsAvailableForKilling, desiredPawnPositionForKill)
        game.findPawnByPosition(desiredPawnPositionForKill)
      } catch (error) {
        return callback({ error: error })
      }

      const pawnToKill = game.findPawnByPosition(desiredPawnPositionForKill)

      if (pawnToKill.owner === player) {
        return callback({ error: 'Le pion à prendre appartient au même joueur' })
      }

      calculatePawnRemainingMoves(currentPawnPosition, desiredPawnPositionForKill, instancedPawn)

      if (player === Player.Player1) {
        game.player2sLostPawns.push(pawnToKill)
      }
      if (player === Player.Player2) {
        game.player1sLostPawns.push(pawnToKill)
      }

      game.board[currentPawnPosition.row][currentPawnPosition.col] = null
      game.board[desiredPawnPositionForKill.row][desiredPawnPositionForKill.col] = instancedPawn

      game.determineWinner()
      io.to(roomId).emit('gameState', game)
    }
  )
}
