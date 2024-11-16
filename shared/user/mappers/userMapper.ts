import User from '../entities/User'
import type UserDto from '../entities/UserDto'

export function userDtoToEntity(userDto: UserDto) {
  return new User(userDto.id, userDto.pseudo, userDto.avatarId, userDto.eloScore)
}

export function userToDto(user: User): UserDto {
  return {
    id: user.id,
    pseudo: user.pseudo,
    avatarId: user.avatarId,
    eloScore: user.eloScore
  }
}
