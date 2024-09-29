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
        new Pawn('player1', 0, 'S'),
        new Pawn('player1', 0, 'S'),
        new Pawn('player1', 0, 'S'),
        new Pawn('player1', 0, 'S'),
        null,
        null
      ],
      [
        null,
        null,
        new Pawn('player1', 0, 'S'),
        new Pawn('player1', 0, 'S'),
        new Pawn('player1', 0, 'S'),
        new Pawn('player1', 0, 'S'),
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
        new Pawn('player2', 0, 'N'),
        new Pawn('player2', 0, 'N'),
        new Pawn('player2', 0, 'N'),
        new Pawn('player2', 0, 'N'),
        null,
        null
      ],
      [
        null,
        null,
        new Pawn('player2', 0, 'N'),
        new Pawn('player2', 0, 'N'),
        new Pawn('player2', 0, 'N'),
        new Pawn('player2', 0, 'N'),
        null,
        null
      ]
    ]
  }
}
