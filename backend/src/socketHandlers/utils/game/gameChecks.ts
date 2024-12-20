import GameState from '../../../../shared/gameState/entities/GameState'
import Pawn from '../../../../shared/pawn/entities/Pawn'
import PawnPosition from '../../../../shared/pawnPosition/entities/PawnPosition'
import { isUndefined } from '../../../../shared/utils/TypeGuard'
import { PlayerRole } from '../../../../shared/gameState/entities/PlayerRoleEnum'

export function checkIfGameExistAndIfIsPlayerTurn(game: GameState, player: PlayerRole) {
  if (isUndefined(game)) {
    console.error("L'état de la partie est introuvable" + JSON.stringify(game))
    throw new Error("L'état de la partie est introuvable")
  }

  if (game.determinePlayerBasedOnTurn() !== player) {
    console.error(
      "Ce n'est pas le tour de ce joueur" + JSON.stringify(player) + ' ' + JSON.stringify(game)
    )
    throw new Error("Ce n'est pas le tour de ce joueur")
  }
}

export function checkIfIsPawnOwner(game: GameState, pawn: Pawn, player: PlayerRole) {
  if (pawn.owner !== player) {
    console.error(
      "Le pion n'appartient pas à ce joueur" + JSON.stringify(pawn) + ' ' + JSON.stringify(game)
    )
    throw new Error("Le pion n'appartient pas à ce joueur")
  }
}

export function checkPawnPositionsAvailable(
  positionsAvailable: PawnPosition[],
  pawnPosition: PawnPosition
) {
  if (positionsAvailable.length === 0) {
    console.error('Le pion ne peut pas bouger' + JSON.stringify(pawnPosition))
    throw new Error('Le pion ne peut pas bouger')
  }

  if (
    !positionsAvailable.some((pos) => pos.row === pawnPosition.row && pos.col === pawnPosition.col)
  ) {
    console.error(
      'Le pion ne peut pas aller dans cette direction' +
        JSON.stringify(pawnPosition) +
        ' ' +
        JSON.stringify(positionsAvailable)
    )
    throw new Error('Le pion ne peut pas aller dans cette direction')
  }
}
