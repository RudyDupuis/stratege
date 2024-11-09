import User from '../entities/User'
import UserDto from '../entities/UserDto'

export function userDtoToEntity(userDto: UserDto) {
  return new User(userDto.id, userDto.pseudo, userDto.elo_score)
}

export function userToDto(user: User): UserDto {
  return {
    id: user.id,
    pseudo: user.pseudo,
    elo_score: user.elo_score
  }
}
