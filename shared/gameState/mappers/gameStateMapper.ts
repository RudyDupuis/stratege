import pawnDtoToEntity from '../../pawn/mappers/pawnMapper'
import GameState from '../entities/GameState'
import GameStateDto from '../entities/GameStateDto'

export default function gameStateDtoToEntity(gameState: GameStateDto) {
  return new GameState(
    gameState.turn,
    gameState.board.map((row) => row.map((pawn) => (pawn ? pawnDtoToEntity(pawn) : null))),
    gameState.player1sLostPawns.map(pawnDtoToEntity),
    gameState.player2sLostPawns.map(pawnDtoToEntity),
    gameState.winner
  )
}
