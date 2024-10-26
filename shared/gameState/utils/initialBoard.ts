import { Orientation } from '../../pawn/entities/OrientationEnum'
import Pawn from '../../pawn/entities/Pawn'
import GameState from '../entities/GameState'
import { Player } from '../entities/PlayerEnum'

export default function initialBoard() {
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
