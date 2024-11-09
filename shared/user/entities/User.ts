import UserDto from './UserDto'

export default class User implements UserDto {
  constructor(
    public readonly id: number,
    public pseudo: string,
    public elo_score: number
  ) {}
}
