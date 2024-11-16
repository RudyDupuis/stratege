import User from '../../user/entities/User'
import EndGameInformationDto from './EndGameInformationDto'
import { PlayerRole } from './PlayerRoleEnum'

export default class EndGameInformation implements EndGameInformationDto {
  constructor(
    public winner: {
      playerRole: PlayerRole
      user?: User
    },
    public loser: {
      playerRole: PlayerRole
      user?: User
    }
  ) {}
}
