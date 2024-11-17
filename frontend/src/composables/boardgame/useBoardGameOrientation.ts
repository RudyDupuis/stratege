import { PlayerRole } from '@shared/gameState/entities/PlayerRoleEnum'

export default function useBoardGameOrientation(player: PlayerRole) {
  return player === PlayerRole.Player1 ? 'rotate-0' : 'rotate-180'
}
