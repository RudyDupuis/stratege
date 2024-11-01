import { Player } from '@shared/gameState/entities/PlayerEnum'

export default function useBoardGameOrientation(player: Player) {
  return player === Player.Player1 ? 'rotate-0' : 'rotate-180'
}
