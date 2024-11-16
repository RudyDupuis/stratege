import { PlayerRole } from '../../gameState/entities/PlayerRoleEnum'

export default interface PlayerInfoDto {
  userId?: string
  socketId?: string
  role: PlayerRole
  isConnected: boolean
}
