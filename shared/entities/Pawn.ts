export class Pawn {
  constructor(
    public readonly owner: 'player1' | 'player2',
    public remainingMove: 0 | 1 | 2,
    public orientation: 'NW' | 'SE' | 'NE' | 'SW'
  ) {}
}
