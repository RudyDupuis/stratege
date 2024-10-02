import { GameState, type GameStateDto } from '../entities/GameState'
import { Pawn, type PawnDto } from '../entities/Pawn'
import { PawnPosition, type PawnPositionDto } from '../entities/PawnPosition'

export function pawnPositionDtoToEntity(pawnPosition: PawnPositionDto) {
  return new PawnPosition(pawnPosition.row, pawnPosition.col)
}

export function pawnDtoToEntity(pawn: PawnDto) {
  return new Pawn(pawn.id, pawn.owner, pawn.remainingMove, pawn.orientation)
}

export function gameStateDtoToEntity(gameState: GameStateDto) {
  return new GameState(
    gameState.turn,
    gameState.board.map((row) => row.map((pawn) => (pawn ? pawnDtoToEntity(pawn) : null))),
    gameState.player1sLostPawns.map(pawnDtoToEntity),
    gameState.player2sLostPawns.map(pawnDtoToEntity),
    gameState.winner
  )
}
