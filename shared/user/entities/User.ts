import type UserDto from './UserDto'

export default class User implements UserDto {
  constructor(
    public readonly id: string,
    public pseudo: string,
    //Todo rename avatarId
    public pictureId: number,
    //Todo rename eloScore
    public elo_score: number
  ) {}
}
