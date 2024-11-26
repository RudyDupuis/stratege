import Pawn from '../../pawn/entities/Pawn'
import { isDefined, isNotNull } from '../../utils/TypeGuard'
import { PlayerRole } from './PlayerRoleEnum'
import type GameStateDto from './GameStateDto'
import buildBoard from '../utils/buildBoard'
import determineWinner from '../utils/determineWinner'
import determinePlayersLostPawns from '../utils/determinePlayersLostPawns'
import { determineAvailablePositionsForActions } from '../utils/determineAvailablePositionsForActions/determineAvailablePositionsForActions'
import PawnPosition from '../../pawnPosition/entities/PawnPosition'
import findPawnByPosition from '../utils/findPawnByPosition'

export default class GameState implements GameStateDto {
  public static readonly MAX_PAWN_MOVEMENT = 2
  public static readonly MAX_PAWNS_PER_PLAYER = 8
  public static readonly BOARD_WIDTH = 8
  public static readonly BOARD_HEIGHT = 8
  public static readonly TURN_TIME_SECONDS = 100
  public static readonly GIVE_UP_TIME_SECONDS = 30

  public board: Array<Array<Pawn | null>>
  public winner: PlayerRole | undefined
  constructor(
    public turn: number,
    public boardPawns: Pawn[]
  ) {
    if (boardPawns.length !== GameState.MAX_PAWNS_PER_PLAYER * 2) {
      throw new Error(
        `Le nombre de pions doit être exactement de ${GameState.MAX_PAWNS_PER_PLAYER * 2}.`
      )
    }

    this.board = buildBoard(this.boardPawns)
    this.checkIfThereIsAWinner()
  }

  public updateBoard() {
    this.board = buildBoard(this.boardPawns)
  }

  public updatePawn(newPawn: Pawn) {
    this.boardPawns = this.boardPawns.map((oldPawn) => {
      if (oldPawn.id === newPawn.id) {
        return newPawn
      }
      return oldPawn
    })
  }

  public checkIfThereIsAWinner() {
    if (isDefined(this.winner)) {
      return
    }

    this.winner = determineWinner(
      this.determinePlayersLostPawns().player1sLostPawns,
      this.determinePlayersLostPawns().player2sLostPawns
    )
  }

  public determinePlayerBasedOnTurn() {
    return this.turn % 2 === 0 ? PlayerRole.Player2 : PlayerRole.Player1
  }

  public determinePlayersLostPawns() {
    return determinePlayersLostPawns(this.boardPawns)
  }

  public findPawnByPosition(pawnPosition: PawnPosition) {
    return findPawnByPosition(this.boardPawns, pawnPosition)
  }

  public resetRemainingMovesPawns() {
    this.boardPawns.forEach((pawn) => {
      pawn.remainingMove = GameState.MAX_PAWN_MOVEMENT
    })
  }

  public resetLastActionAndPositionPawns() {
    this.boardPawns.forEach((pawn) => {
      pawn.lastAction = undefined
      pawn.lastPosition = undefined
    })
  }

  public determineAvailablePositionsForActions(pawn: Pawn, player: PlayerRole) {
    return determineAvailablePositionsForActions(this, pawn, player)
  }

  public static isInBoardGameBounds(board: GameState['board'], row: number, col: number) {
    return row >= 0 && row < board.length && col >= 0 && col < board[0].length
  }
  public static isCellOccupied(board: GameState['board'], row: number, col: number) {
    return isNotNull(board[row][col])
  }
}
