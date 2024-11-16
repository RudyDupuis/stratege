import type UserDto from './UserDto'

export default class User implements UserDto {
  constructor(
    public readonly id: string,
    public pseudo: string,
    public avatarId: number,
    public eloScore: number
  ) {}
}
