import { Pawn } from './Pawn'

export class GameState {
  constructor(
    public turn: number,
    public board: (Pawn | null)[][]
  ) {}

  public static initialBoard() {
    return [
      [
        null,
        null,
        new Pawn('player1', 0, 'SE'),
        new Pawn('player1', 0, 'SE'),
        new Pawn('player1', 0, 'SE'),
        new Pawn('player1', 0, 'SE'),
        null,
        null
      ],
      [
        null,
        null,
        new Pawn('player1', 0, 'SE'),
        new Pawn('player1', 0, 'SE'),
        new Pawn('player1', 0, 'SE'),
        new Pawn('player1', 0, 'SE'),
        null,
        null
      ],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [
        null,
        null,
        new Pawn('player2', 0, 'NW'),
        new Pawn('player2', 0, 'NW'),
        new Pawn('player2', 0, 'NW'),
        new Pawn('player2', 0, 'NW'),
        null,
        null
      ],
      [
        null,
        null,
        new Pawn('player2', 0, 'NW'),
        new Pawn('player2', 0, 'NW'),
        new Pawn('player2', 0, 'NW'),
        new Pawn('player2', 0, 'NW'),
        null,
        null
      ]
    ]
  }
}
