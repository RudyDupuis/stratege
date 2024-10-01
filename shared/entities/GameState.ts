import { Orientation, Player } from '../Enum'
import { Pawn } from './Pawn'
import { PawnPosition } from './PawnPosition'
import { isDefined, isNotNull } from '../helpers/TypeGuard'

export class GameState {
  constructor(
    public turn: number,
    public board: (Pawn | null)[][],
    public player1sLostPawns: Pawn[],
    public player2sLostPawns: Pawn[],
    public winner: Player | undefined
  ) {}

  public static readonly MAX_PAWN_MOVEMENT = 2
  public static readonly MAX_PAWNS_PER_PLAYER = 8

  public static initialBoard() {
    return [
      [
        null,
        null,
        new Pawn('p2-1', Player.Player2, GameState.MAX_PAWN_MOVEMENT, Orientation.SE),
        new Pawn('p2-2', Player.Player2, GameState.MAX_PAWN_MOVEMENT, Orientation.SE),
        new Pawn('p2-3', Player.Player2, GameState.MAX_PAWN_MOVEMENT, Orientation.SE),
        new Pawn('p2-4', Player.Player2, GameState.MAX_PAWN_MOVEMENT, Orientation.SE),
        null,
        null
      ],
      [
        null,
        null,
        new Pawn('p2-5', Player.Player2, GameState.MAX_PAWN_MOVEMENT, Orientation.SE),
        new Pawn('p2-6', Player.Player2, GameState.MAX_PAWN_MOVEMENT, Orientation.SE),
        new Pawn('p2-7', Player.Player2, GameState.MAX_PAWN_MOVEMENT, Orientation.SE),
        new Pawn('p2-8', Player.Player2, GameState.MAX_PAWN_MOVEMENT, Orientation.SE),
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
        new Pawn('p1-1', Player.Player1, GameState.MAX_PAWN_MOVEMENT, Orientation.NW),
        new Pawn('p1-2', Player.Player1, GameState.MAX_PAWN_MOVEMENT, Orientation.NW),
        new Pawn('p1-3', Player.Player1, GameState.MAX_PAWN_MOVEMENT, Orientation.NW),
        new Pawn('p1-4', Player.Player1, GameState.MAX_PAWN_MOVEMENT, Orientation.NW),
        null,
        null
      ],
      [
        null,
        null,
        new Pawn('p1-5', Player.Player1, GameState.MAX_PAWN_MOVEMENT, Orientation.NW),
        new Pawn('p1-6', Player.Player1, GameState.MAX_PAWN_MOVEMENT, Orientation.NW),
        new Pawn('p1-7', Player.Player1, GameState.MAX_PAWN_MOVEMENT, Orientation.NW),
        new Pawn('p1-8', Player.Player1, GameState.MAX_PAWN_MOVEMENT, Orientation.NW),
        null,
        null
      ]
    ]
  }

  public determinePlayerBasedOnTurn() {
    return this.turn % 2 === 0 ? Player.Player2 : Player.Player1
  }

  public determineWinner() {
    if (this.player1sLostPawns.length === GameState.MAX_PAWNS_PER_PLAYER) {
      this.winner = Player.Player2
    }
    if (this.player2sLostPawns.length === GameState.MAX_PAWNS_PER_PLAYER) {
      this.winner = Player.Player1
    }
  }

  public resetRemainingMoves() {
    this.board.forEach((row) =>
      row.forEach((pawn) => {
        if (isNotNull(pawn)) {
          return (pawn.remainingMove = GameState.MAX_PAWN_MOVEMENT)
        }
      })
    )
  }

  public findPawn(pawnToFind: Pawn) {
    const pawn = this.board.flat().find((pawn) => pawn?.id === pawnToFind.id)

    if (isNotNull(pawn) && isDefined(pawn)) {
      return pawn
    }

    throw new Error('Le pion est introuvable')
  }

  public findPawnByPosition(pawnPosition: PawnPosition) {
    const pawn = this.board[pawnPosition.row][pawnPosition.col]

    if (isNotNull(pawn)) {
      return pawn
    }

    throw new Error('Le pion est introuvable')
  }

  public calculatePawnPosition(pawn: Pawn) {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col]?.id === pawn.id) {
          return new PawnPosition(row, col)
        }
      }
    }

    throw new Error('Le pion est introuvable')
  }

  public calculatePositionsAvailableForMovingKillingPushingOrPulling(pawn: Pawn, player: Player) {
    const positionsAvailableForMoving: PawnPosition[] = []
    const positionsAvailableForKilling: PawnPosition[] = []
    const positionsAvailableForPushing: PawnPosition[] = []
    const positionsAvailableForPulling: PawnPosition[] = []

    const pawnPosition = this.calculatePawnPosition(pawn)
    const remainingMove = pawn.remainingMove

    this.calculatePositionsAvailableForMovingOrKillingByMovingOneCellAtATime(
      pawnPosition,
      remainingMove,
      player,
      positionsAvailableForMoving,
      positionsAvailableForKilling
    )

    this.calculatePositionsAvailableForPushingOrPulling(
      pawnPosition,
      remainingMove,
      positionsAvailableForPushing,
      positionsAvailableForPulling
    )

    return {
      returnedPositionsAvailableForMoving: positionsAvailableForMoving,
      returnedPositionsAvailableForKilling: positionsAvailableForKilling,
      returnedPositionsAvailableForPushing: positionsAvailableForPushing,
      returnedPositionsAvailableForPulling: positionsAvailableForPulling
    }
  }

  private top = new PawnPosition(-1, 0)
  private bottom = new PawnPosition(1, 0)
  private left = new PawnPosition(0, -1)
  private right = new PawnPosition(0, 1)
  private directions = [this.top, this.bottom, this.left, this.right]

  private pawnCanPushOrPullOtherPawn(
    arrivalPositionRow: number,
    arrivalPositionCol: number,
    positionsAvailable: PawnPosition[]
  ) {
    //If there is no pawn behind otherPawn and cell is in bounds (Pushing)
    //If there is no pawn below the current pawn and cell is in bounds (Pulling)
    if (
      this.isInBoardGameBounds(arrivalPositionRow, arrivalPositionCol) &&
      !this.isCellOccupied(arrivalPositionRow, arrivalPositionCol)
    ) {
      positionsAvailable.push(new PawnPosition(arrivalPositionRow, arrivalPositionCol))
    }
  }

  private calculatePositionsAvailableForPushingOrPulling(
    currentPosition: PawnPosition,
    remainingMove: number,
    positionsAvailableForPushing: PawnPosition[],
    positionsAvailableForPulling: PawnPosition[]
  ) {
    if (remainingMove === 0) {
      return
    }

    for (const direction of this.directions) {
      const newRow = currentPosition.row + direction.row
      const newCol = currentPosition.col + direction.col

      if (this.isInBoardGameBounds(newRow, newCol) && this.isCellOccupied(newRow, newCol)) {
        switch (direction) {
          case this.top:
            this.pawnCanPushOrPullOtherPawn(newRow - 1, newCol, positionsAvailableForPushing)
            this.pawnCanPushOrPullOtherPawn(newRow + 2, newCol, positionsAvailableForPulling)
            break

          case this.bottom:
            this.pawnCanPushOrPullOtherPawn(newRow + 1, newCol, positionsAvailableForPushing)
            this.pawnCanPushOrPullOtherPawn(newRow - 2, newCol, positionsAvailableForPulling)
            break

          case this.left:
            this.pawnCanPushOrPullOtherPawn(newRow, newCol - 1, positionsAvailableForPushing)
            this.pawnCanPushOrPullOtherPawn(newRow, newCol + 2, positionsAvailableForPulling)
            break

          case this.right:
            this.pawnCanPushOrPullOtherPawn(newRow, newCol + 1, positionsAvailableForPushing)
            this.pawnCanPushOrPullOtherPawn(newRow, newCol - 2, positionsAvailableForPulling)
        }
      }
    }
  }

  private pawnCanKillOtherPawn(
    otherPawn: Pawn,
    orientation1: Orientation,
    orientation2: Orientation,
    positionsAvailableForKilling: PawnPosition[],
    newPosition: PawnPosition
  ) {
    if (otherPawn.orientation === orientation1 || otherPawn.orientation === orientation2) {
      positionsAvailableForKilling.push(newPosition)
    }
  }

  private calculatePositionsAvailableForMovingOrKillingByMovingOneCellAtATime(
    currentPosition: PawnPosition,
    remainingMove: number,
    player: Player,
    positionsAvailableForMoving: PawnPosition[],
    positionsAvailableForKilling: PawnPosition[]
  ) {
    if (remainingMove === 0) {
      return
    }

    for (const direction of this.directions) {
      const newRow = currentPosition.row + direction.row
      const newCol = currentPosition.col + direction.col
      const newPosition = new PawnPosition(newRow, newCol)

      if (this.isInBoardGameBounds(newRow, newCol)) {
        if (this.isCellOccupied(newRow, newCol)) {
          const otherPawn = this.findPawn(this.board[newRow][newCol] as Pawn)

          if (otherPawn.owner !== player) {
            switch (direction) {
              case this.top:
                this.pawnCanKillOtherPawn(
                  otherPawn,
                  Orientation.NW,
                  Orientation.NE,
                  positionsAvailableForKilling,
                  newPosition
                )
                break

              case this.bottom:
                this.pawnCanKillOtherPawn(
                  otherPawn,
                  Orientation.SW,
                  Orientation.SE,
                  positionsAvailableForKilling,
                  newPosition
                )
                break

              case this.left:
                this.pawnCanKillOtherPawn(
                  otherPawn,
                  Orientation.NW,
                  Orientation.SW,
                  positionsAvailableForKilling,
                  newPosition
                )
                break

              case this.right:
                this.pawnCanKillOtherPawn(
                  otherPawn,
                  Orientation.SE,
                  Orientation.NE,
                  positionsAvailableForKilling,
                  newPosition
                )
                break
            }
          }
        } else {
          if (
            !positionsAvailableForMoving.some((pos) => pos.row === newRow && pos.col === newCol)
          ) {
            positionsAvailableForMoving.push(newPosition)
            this.calculatePositionsAvailableForMovingOrKillingByMovingOneCellAtATime(
              newPosition,
              remainingMove - 1,
              player,
              positionsAvailableForMoving,
              positionsAvailableForKilling
            )
          }
        }
      }
    }
  }

  private isInBoardGameBounds(row: number, col: number) {
    return row >= 0 && row < this.board.length && col >= 0 && col < this.board[0].length
  }
  private isCellOccupied(row: number, col: number) {
    return isNotNull(this.board[row][col])
  }
}
