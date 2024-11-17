import { isDefined } from '../../utils/TypeGuard'
import { userDtoToEntity, userToDto } from '../../user/mappers/userMapper'
import EndGameInformation from '../entities/EndGameInformation'
import type EndGameInformationDto from '../entities/EndGameInformationDto'

export function endGameInformationDtoToEntity(endGameInformationDto: EndGameInformationDto) {
  return new EndGameInformation(
    {
      playerRole: endGameInformationDto.winner.playerRole,
      user: isDefined(endGameInformationDto.winner.user)
        ? userDtoToEntity(endGameInformationDto.winner.user)
        : undefined
    },
    {
      playerRole: endGameInformationDto.loser.playerRole,
      user: isDefined(endGameInformationDto.loser.user)
        ? userDtoToEntity(endGameInformationDto.loser.user)
        : undefined
    }
  )
}

export function endGameInformationToDto(endGameInformation: EndGameInformation) {
  return {
    winner: {
      playerRole: endGameInformation.winner.playerRole,
      user: isDefined(endGameInformation.winner.user)
        ? userToDto(endGameInformation.winner.user)
        : undefined
    },
    loser: {
      playerRole: endGameInformation.loser.playerRole,
      user: isDefined(endGameInformation.loser.user)
        ? userToDto(endGameInformation.loser.user)
        : undefined
    }
  }
}
