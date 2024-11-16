import { PlayerRole } from './PlayerRoleEnum'
import UserDto from '../../user/entities/UserDto'

export default interface EndGameInformationDto {
  winner: {
    playerRole: PlayerRole
    user?: UserDto
  }
  loser: {
    playerRole: PlayerRole
    user?: UserDto
  }
}
