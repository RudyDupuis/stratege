import { Orientation } from '../../pawn/entities/OrientationEnum'
import Pawn from '../../pawn/entities/Pawn'
import PawnPosition from '../../pawnPosition/entities/PawnPosition'
import GameState from '../entities/GameState'
import { PlayerRole } from '../entities/PlayerRoleEnum'

export default function initialBoard() {
  return [
    new Pawn(
      'p2-1',
      PlayerRole.Player2,
      true,
      GameState.MAX_PAWN_MOVEMENT,
      Orientation.SE,
      new PawnPosition(0, 2)
    ),
    new Pawn(
      'p2-2',
      PlayerRole.Player2,
      true,
      GameState.MAX_PAWN_MOVEMENT,
      Orientation.SE,
      new PawnPosition(0, 3)
    ),
    new Pawn(
      'p2-3',
      PlayerRole.Player2,
      true,
      GameState.MAX_PAWN_MOVEMENT,
      Orientation.SE,
      new PawnPosition(0, 4)
    ),
    new Pawn(
      'p2-4',
      PlayerRole.Player2,
      true,
      GameState.MAX_PAWN_MOVEMENT,
      Orientation.SE,
      new PawnPosition(0, 5)
    ),
    new Pawn(
      'p2-5',
      PlayerRole.Player2,
      true,
      GameState.MAX_PAWN_MOVEMENT,
      Orientation.SE,
      new PawnPosition(1, 2)
    ),
    new Pawn(
      'p2-6',
      PlayerRole.Player2,
      true,
      GameState.MAX_PAWN_MOVEMENT,
      Orientation.SE,
      new PawnPosition(1, 3)
    ),
    new Pawn(
      'p2-7',
      PlayerRole.Player2,
      true,
      GameState.MAX_PAWN_MOVEMENT,
      Orientation.SE,
      new PawnPosition(1, 4)
    ),
    new Pawn(
      'p2-8',
      PlayerRole.Player2,
      true,
      GameState.MAX_PAWN_MOVEMENT,
      Orientation.SE,
      new PawnPosition(1, 5)
    ),
    new Pawn(
      'p1-1',
      PlayerRole.Player1,
      true,
      GameState.MAX_PAWN_MOVEMENT,
      Orientation.NW,
      new PawnPosition(6, 2)
    ),
    new Pawn(
      'p1-2',
      PlayerRole.Player1,
      true,
      GameState.MAX_PAWN_MOVEMENT,
      Orientation.NW,
      new PawnPosition(6, 3)
    ),
    new Pawn(
      'p1-3',
      PlayerRole.Player1,
      true,
      GameState.MAX_PAWN_MOVEMENT,
      Orientation.NW,
      new PawnPosition(6, 4)
    ),
    new Pawn(
      'p1-4',
      PlayerRole.Player1,
      true,
      GameState.MAX_PAWN_MOVEMENT,
      Orientation.NW,
      new PawnPosition(6, 5)
    ),
    new Pawn(
      'p1-5',
      PlayerRole.Player1,
      true,
      GameState.MAX_PAWN_MOVEMENT,
      Orientation.NW,
      new PawnPosition(7, 2)
    ),
    new Pawn(
      'p1-6',
      PlayerRole.Player1,
      true,
      GameState.MAX_PAWN_MOVEMENT,
      Orientation.NW,
      new PawnPosition(7, 3)
    ),
    new Pawn(
      'p1-7',
      PlayerRole.Player1,
      true,
      GameState.MAX_PAWN_MOVEMENT,
      Orientation.NW,
      new PawnPosition(7, 4)
    ),
    new Pawn(
      'p1-8',
      PlayerRole.Player1,
      true,
      GameState.MAX_PAWN_MOVEMENT,
      Orientation.NW,
      new PawnPosition(7, 5)
    )
  ]
}
