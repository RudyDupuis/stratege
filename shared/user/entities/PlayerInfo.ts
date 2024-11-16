import { PlayerRole } from '../../gameState/entities/PlayerRoleEnum'
import PlayerInfoDto from './PlayerInfoDto'

export default class PlayerInfo implements PlayerInfoDto {
  constructor(
    public role: PlayerRole,
    public isConnected: boolean = false,
    public userId?: string,
    public socketId?: string
  ) {}
}
