import type { Pawn } from '@shared/entities/Pawn'
import type { PawnPosition } from '@shared/entities/PawnPosition'
import { Socket } from 'socket.io-client'
import type { Ref } from 'vue'

interface SocketResponse {
  error?: string
}

function handleSocketResponse(errorMessage: Ref<string | undefined>, response: SocketResponse) {
  if (response.error) {
    errorMessage.value = response.error
  }
}

export function passTurnSocket(
  socket: Socket,
  roomId: string,
  player: 'player1' | 'player2',
  errorMessage: Ref<string | undefined>
) {
  socket.emit('passTurn', roomId, player, (response: SocketResponse) => {
    handleSocketResponse(errorMessage, response)
  })
}

export function movePawnSocket(
  socket: Socket,
  roomId: string,
  player: 'player1' | 'player2',
  pawn: Pawn,
  desiredPawnPosition: PawnPosition,
  errorMessage: Ref<string | undefined>
) {
  socket.emit('movePawn', roomId, player, pawn, desiredPawnPosition, (response: SocketResponse) => {
    handleSocketResponse(errorMessage, response)
  })
}

export function killPawnSocket(
  socket: Socket,
  roomId: string,
  player: 'player1' | 'player2',
  pawn: Pawn,
  desiredPawnPosition: PawnPosition,
  errorMessage: Ref<string | undefined>
) {
  socket.emit('killPawn', roomId, player, pawn, desiredPawnPosition, (response: SocketResponse) => {
    handleSocketResponse(errorMessage, response)
  })
}

export function rotatePawnSocket(
  socket: Socket,
  roomId: string,
  player: 'player1' | 'player2',
  pawn: Pawn,
  orientation: 'NW' | 'SE' | 'NE' | 'SW',
  errorMessage: Ref<string | undefined>
) {
  socket.emit('rotatePawn', roomId, player, pawn, orientation, (response: SocketResponse) => {
    handleSocketResponse(errorMessage, response)
  })
}
