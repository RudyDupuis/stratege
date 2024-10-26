import pawnDtoToEntity from '../../pawn/mappers/pawnMapper'
import GameState from '../entities/GameState'
import type GameStateDto from '../entities/GameStateDto'

export default function gameStateDtoToEntity(gameState: GameStateDto) {
  return new GameState(
    gameState.turn,
    gameState.boardPawns.map((pawn) => pawnDtoToEntity(pawn))
  )
}
