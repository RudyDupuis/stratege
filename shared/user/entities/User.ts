import type UserDto from './UserDto'

export default class User implements UserDto {
  constructor(
    public readonly id: string,
    public pseudo: string,
    public elo_score: number
  ) {}
}
