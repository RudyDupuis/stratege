import { PlayerRole } from '../../gameState/entities/PlayerRoleEnum'

export default interface PlayerInfoDto {
  role: PlayerRole
  isConnected: boolean
  userId?: string
  socketId?: string
}
