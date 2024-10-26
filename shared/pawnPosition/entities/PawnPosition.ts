import type PawnPositionDto from './PawnPositionDto'

export default class PawnPosition implements PawnPositionDto {
  constructor(
    public row: number,
    public col: number
  ) {}
}
