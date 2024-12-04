import { Server } from 'socket.io'
import GameState from '../../../../shared/gameState/entities/GameState'
import { PlayerRole } from '../../../../shared/gameState/entities/PlayerRoleEnum'
import { Callback } from 'src/socketHandlers/socketHandlers'
import playAMoveRecursivelyAndPassTurnIfNoMorePawnToDoAction from './playAMoveRecursivelyAndPassTurnIfNoMorePawnToDoAction'
import { games } from '../record/gameRecords'

export default function aiHandlers(roomId: string, io: Server, callback: Callback) {
  const gameState = games[roomId]
  const aiRole = PlayerRole.Player2
  const aiPawns = gameState.boardPawns.filter((pawn) => pawn.owner === aiRole && pawn.isAlive)

  setTimeout(
    () =>
      playAMoveRecursivelyAndPassTurnIfNoMorePawnToDoAction(
        gameState,
        roomId,
        aiRole,
        aiPawns,
        io,
        callback
      ),
    1000
  )
}
