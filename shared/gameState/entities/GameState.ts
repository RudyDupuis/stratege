import { Orientation } from '../../pawn/entities/OrientationEnum'
import Pawn from '../../pawn/entities/Pawn'
import PawnPosition from '../../pawnPosition/entities/PawnPosition'
import { isDefined, isNotNull } from '../../utils/TypeGuard'
import { Player } from './PlayerEnum'

export default class GameState {
  constructor(
    public turn: number,
    public board: (Pawn | null)[][],
    public player1sLostPawns: Pawn[],
    public player2sLostPawns: Pawn[],
    public winner: Player | undefined
  ) {}

  public static readonly MAX_PAWN_MOVEMENT = 2
  public static readonly MAX_PAWNS_PER_PLAYER = 8

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

    console.error('Le pion est introuvable (méthode findPawn) ' + JSON.stringify(pawnToFind))
    throw new Error('Le pion est introuvable')
  }

  public findPawnByPosition(pawnPosition: PawnPosition) {
    const pawn = this.board[pawnPosition.row][pawnPosition.col]

    if (isNotNull(pawn)) {
      return pawn
    }

    console.error(
      'Le pion est introuvable (méthode findPawnByPosition) ' + JSON.stringify(pawnPosition)
    )
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

    console.error('Le pion est introuvable (méthode calculatePawnPosition) ' + JSON.stringify(pawn))
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

  public static readonly TOP = new PawnPosition(-1, 0)
  public static readonly BOTTOM = new PawnPosition(1, 0)
  public static readonly LEFT = new PawnPosition(0, -1)
  public static readonly RIGHT = new PawnPosition(0, 1)
  public static readonly DIRECTIONS = [
    GameState.TOP,
    GameState.BOTTOM,
    GameState.LEFT,
    GameState.RIGHT
  ]

  public pawnCanPushOrPullOtherPawn(
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

  public calculatePositionsAvailableForPushingOrPulling(
    currentPosition: PawnPosition,
    remainingMove: number,
    positionsAvailableForPushing: PawnPosition[],
    positionsAvailableForPulling: PawnPosition[]
  ) {
    if (remainingMove === 0) {
      return
    }

    for (const direction of GameState.DIRECTIONS) {
      const newRow = currentPosition.row + direction.row
      const newCol = currentPosition.col + direction.col

      if (this.isInBoardGameBounds(newRow, newCol) && this.isCellOccupied(newRow, newCol)) {
        switch (direction) {
          case GameState.TOP:
            this.pawnCanPushOrPullOtherPawn(newRow - 1, newCol, positionsAvailableForPushing)
            this.pawnCanPushOrPullOtherPawn(newRow + 2, newCol, positionsAvailableForPulling)
            break

          case GameState.BOTTOM:
            this.pawnCanPushOrPullOtherPawn(newRow + 1, newCol, positionsAvailableForPushing)
            this.pawnCanPushOrPullOtherPawn(newRow - 2, newCol, positionsAvailableForPulling)
            break

          case GameState.LEFT:
            this.pawnCanPushOrPullOtherPawn(newRow, newCol - 1, positionsAvailableForPushing)
            this.pawnCanPushOrPullOtherPawn(newRow, newCol + 2, positionsAvailableForPulling)
            break

          case GameState.RIGHT:
            this.pawnCanPushOrPullOtherPawn(newRow, newCol + 1, positionsAvailableForPushing)
            this.pawnCanPushOrPullOtherPawn(newRow, newCol - 2, positionsAvailableForPulling)
        }
      }
    }
  }

  public pawnCanKillOtherPawn(
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

  public calculatePositionsAvailableForMovingOrKillingByMovingOneCellAtATime(
    currentPosition: PawnPosition,
    remainingMove: number,
    player: Player,
    positionsAvailableForMoving: PawnPosition[],
    positionsAvailableForKilling: PawnPosition[]
  ) {
    if (remainingMove === 0) {
      return
    }

    for (const direction of GameState.DIRECTIONS) {
      const newRow = currentPosition.row + direction.row
      const newCol = currentPosition.col + direction.col
      const newPosition = new PawnPosition(newRow, newCol)

      if (this.isInBoardGameBounds(newRow, newCol)) {
        if (this.isCellOccupied(newRow, newCol)) {
          const otherPawn = this.findPawn(this.board[newRow][newCol] as Pawn)

          if (otherPawn.owner !== player) {
            switch (direction) {
              case GameState.TOP:
                this.pawnCanKillOtherPawn(
                  otherPawn,
                  Orientation.NW,
                  Orientation.NE,
                  positionsAvailableForKilling,
                  newPosition
                )
                break

              case GameState.BOTTOM:
                this.pawnCanKillOtherPawn(
                  otherPawn,
                  Orientation.SW,
                  Orientation.SE,
                  positionsAvailableForKilling,
                  newPosition
                )
                break

              case GameState.LEFT:
                this.pawnCanKillOtherPawn(
                  otherPawn,
                  Orientation.NW,
                  Orientation.SW,
                  positionsAvailableForKilling,
                  newPosition
                )
                break

              case GameState.RIGHT:
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

  public isInBoardGameBounds(row: number, col: number) {
    return row >= 0 && row < this.board.length && col >= 0 && col < this.board[0].length
  }
  public isCellOccupied(row: number, col: number) {
    return isNotNull(this.board[row][col])
  }
}
