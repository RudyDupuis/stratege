import { isDefined, isUndefined } from '../../../../shared/utils/TypeGuard'
import GameState from '../../../../shared/gameState/entities/GameState'
import { PlayerRole } from '../../../../shared/gameState/entities/PlayerRoleEnum'
import Pawn from '../../../../shared/pawn/entities/Pawn'
import PawnPosition from '../../../../shared/pawnPosition/entities/PawnPosition'
import { Action } from '../../../../shared/pawn/entities/ActionEnum'

interface possibleActionsForAllPawns {
  pawn: Pawn
  positions: PawnPosition[]
}

interface Move {
  action: Action
  pawn: Pawn
  desiredPawnPosition: PawnPosition
}
export default function findBestRandomMove(
  aiPawns: Pawn[],
  gameState: GameState,
  aiRole: PlayerRole
): Move | null {
  const possibleMovesForAllPawns: possibleActionsForAllPawns[] = []
  const possibleKillsForAllPawns: possibleActionsForAllPawns[] = []
  const possiblePushesForAllPawns: possibleActionsForAllPawns[] = []
  const possiblePullsForAllPawns: possibleActionsForAllPawns[] = []

  aiPawns.forEach((pawn) => {
    if (pawn.remainingMove === 0) {
      return
    }

    const availablePositionsForActions = gameState.determineAvailablePositionsForActions(
      pawn,
      aiRole
    )

    if (availablePositionsForActions.positionsAvailableForMoving.length > 0) {
      possibleMovesForAllPawns.push({
        pawn: pawn,
        positions: availablePositionsForActions.positionsAvailableForMoving
      })
    }

    if (availablePositionsForActions.positionsAvailableForKilling.length > 0) {
      possibleKillsForAllPawns.push({
        pawn: pawn,
        positions: availablePositionsForActions.positionsAvailableForKilling
      })
    }

    if (availablePositionsForActions.positionsAvailableForPushing.length > 0) {
      possiblePushesForAllPawns.push({
        pawn: pawn,
        positions: availablePositionsForActions.positionsAvailableForPushing
      })
    }

    if (availablePositionsForActions.positionsAvailableForPulling.length > 0) {
      possiblePullsForAllPawns.push({
        pawn: pawn,
        positions: availablePositionsForActions.positionsAvailableForPulling
      })
    }
  })

  if (possibleKillsForAllPawns.length > 0) {
    const possiblesKillsForOnePawn =
      possibleKillsForAllPawns[Math.floor(Math.random() * possibleKillsForAllPawns.length)]
    return {
      action: Action.Kill,
      pawn: possiblesKillsForOnePawn.pawn,
      desiredPawnPosition:
        possiblesKillsForOnePawn.positions[
          Math.floor(Math.random() * possiblesKillsForOnePawn.positions.length)
        ]
    }
  }

  // Pull if it's an opponent pawn
  if (possiblePullsForAllPawns.length > 0) {
    let move: Move | undefined

    possiblePullsForAllPawns.forEach((possiblePullForOnePawn) => {
      possiblePullForOnePawn.positions.forEach((position) => {
        const pawnToPullPosition = new PawnPosition(
          possiblePullForOnePawn.pawn.position.row +
            possiblePullForOnePawn.pawn.position.row -
            position.row,
          possiblePullForOnePawn.pawn.position.col +
            possiblePullForOnePawn.pawn.position.col -
            position.col
        )

        const pawnToPull = gameState.findPawnByPosition(pawnToPullPosition)

        if (isDefined(pawnToPull) && pawnToPull.owner === PlayerRole.Player1) {
          move = {
            action: Action.Pull,
            pawn: possiblePullForOnePawn.pawn,
            desiredPawnPosition: position
          }
          return
        }
      })
    })

    if (isDefined(move)) {
      return move
    }
  }

  if (possiblePushesForAllPawns.length > 0) {
    let move: Move | undefined

    possiblePushesForAllPawns.forEach((possiblePushForOnePawn) => {
      possiblePushForOnePawn.positions.forEach((position) => {
        if (position.row > possiblePushForOnePawn.pawn.position.row) {
          move = {
            action: Action.Push,
            pawn: possiblePushForOnePawn.pawn,
            desiredPawnPosition: position
          }
          return
        }
      })
    })

    if (isDefined(move)) {
      return move
    }
  }

  if (possibleMovesForAllPawns.length > 0) {
    const possibleMovesForOnePawn =
      possibleMovesForAllPawns[Math.floor(Math.random() * possibleMovesForAllPawns.length)]
    return {
      action: Action.Move,
      pawn: possibleMovesForOnePawn.pawn,
      desiredPawnPosition:
        possibleMovesForOnePawn.positions[
          Math.floor(Math.random() * possibleMovesForOnePawn.positions.length)
        ]
    }
  }

  return null
}
