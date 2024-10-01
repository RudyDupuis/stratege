import { GameState } from '@shared/entities/GameState'
import { Pawn } from '@shared/entities/Pawn'
import { PawnPosition } from '@shared/entities/PawnPosition'
import { isUndefined } from '@shared/helpers/TypeGuard'

export function checkIfGameExistAndIfIsPlayerTurn(game: GameState, player: 'player1' | 'player2') {
  if (isUndefined(game)) {
    throw new Error("L'état de la partie est introuvable")
  }

  if (game.determinePlayerBasedOnTurn() !== player) {
    throw new Error("Ce n'est pas le tour de ce joueur")
  }
}

export function checkIfPawnExistAndIfIsPawnOwner(
  game: GameState,
  pawn: Pawn,
  player: 'player1' | 'player2'
) {
  try {
    game.findPawn(pawn)
  } catch (error) {
    throw new Error(error)
  }

  if (pawn.owner !== player) {
    throw new Error("Le pion n'appartient pas à ce joueur")
  }
}

export function checkPawnPositionOnGameBoard(game: GameState, pawn: Pawn) {
  try {
    game.calculatePawnPosition(pawn)
  } catch (error) {
    throw new Error(error)
  }
}

export function checkPawnMovements(
  availablePawnMovement: PawnPosition[],
  pawnPosition: PawnPosition
) {
  if (availablePawnMovement.length === 0) {
    throw new Error('Le pion ne peut pas bouger')
  }

  if (
    !availablePawnMovement.some(
      (pos) => pos.row === pawnPosition.row && pos.col === pawnPosition.col
    )
  ) {
    throw new Error('Le pion ne peut pas aller dans cette direction')
  }
}
