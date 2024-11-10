import type UserDto from './UserDto'

export default class User implements UserDto {
  constructor(
    public readonly id: string,
    public pseudo: string,
    public pictureId: number,
    public elo_score: number
  ) {}
}
