import { Pawn } from './Pawn'
import { PawnPosition } from './PawnPosition'

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
        new Pawn('player2', 2, 'NW'),
        new Pawn('player2', 2, 'NW'),
        new Pawn('player2', 2, 'NW'),
        new Pawn('player2', 2, 'NW'),
        null,
        null
      ],
      [
        null,
        null,
        new Pawn('player2', 2, 'NW'),
        new Pawn('player2', 2, 'NW'),
        new Pawn('player2', 2, 'NW'),
        new Pawn('player2', 2, 'NW'),
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
        new Pawn('player1', 2, 'SE'),
        new Pawn('player1', 2, 'SE'),
        new Pawn('player1', 2, 'SE'),
        new Pawn('player1', 2, 'SE'),
        null,
        null
      ],
      [
        null,
        null,
        new Pawn('player1', 2, 'SE'),
        new Pawn('player1', 2, 'SE'),
        new Pawn('player1', 2, 'SE'),
        new Pawn('player1', 2, 'SE'),
        null,
        null
      ]
    ]
  }

  public calculatePawnPosition(pawn: Pawn) {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === pawn) {
          return new PawnPosition(row, col)
        }
      }
    }

    throw new Error('Le pion est introuvable')
  }

  public calculateAvailableMoves(pawn: Pawn) {
    const availableMoves: PawnPosition[] = []
    const pawnPosition = this.calculatePawnPosition(pawn)
    const remainingMove = pawn.remainingMove

    this.calculateAvailableMovesByMovingOneCellAtATime(pawnPosition, remainingMove, availableMoves)

    return availableMoves
  }

  private calculateAvailableMovesByMovingOneCellAtATime(
    currentPosition: PawnPosition,
    remainingMove: number,
    availableMoves: PawnPosition[]
  ) {
    if (remainingMove === 0) {
      return
    }

    const directions = [
      new PawnPosition(-1, 0), //Top
      new PawnPosition(1, 0), //Bottom
      new PawnPosition(0, -1), //Left
      new PawnPosition(0, 1) //Right
    ]

    for (const direction of directions) {
      const newRow = currentPosition.row + direction.row
      const newCol = currentPosition.col + direction.col

      if (this.isInBoardGameBounds(newRow, newCol) && !this.isCellOccupied(newRow, newCol)) {
        const newPosition = new PawnPosition(newRow, newCol)

        if (!availableMoves.some((pos) => pos.row === newRow && pos.col === newCol)) {
          availableMoves.push(newPosition)
          this.calculateAvailableMovesByMovingOneCellAtATime(
            newPosition,
            remainingMove - 1,
            availableMoves
          )
        }
      }
    }
  }

  private isInBoardGameBounds(row: number, col: number) {
    return row >= 0 && row < this.board.length && col >= 0 && col < this.board[0].length
  }
  private isCellOccupied(row: number, col: number) {
    return this.board[row][col] !== null
  }
}
