export interface PawnPositionDto {
  row: number
  col: number
}
export class PawnPosition {
  constructor(
    public row: number,
    public col: number
  ) {}
}
