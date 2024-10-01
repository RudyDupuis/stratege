import type { Pawn } from '@shared/entities/Pawn'
import type { PawnPosition } from '@shared/entities/PawnPosition'
import { isUndefined } from '@shared/helpers/TypeGuard'
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

export function passTurnSocketHandler(
  socket: Socket,
  roomId: string,
  player: 'player1' | 'player2',
  errorMessage: Ref<string | undefined>,
  isPlayerTurn: boolean
) {
  if (!isPlayerTurn) {
    return
  }

  socket.emit('passTurn', roomId, player, (response: SocketResponse) => {
    handleSocketResponse(errorMessage, response)
  })
}

export function movePawnSocketHandler(
  socket: Socket,
  roomId: string,
  player: 'player1' | 'player2',
  targetPawn: Pawn | undefined,
  desiredPawnPosition: PawnPosition,
  errorMessage: Ref<string | undefined>,
  isPlayerTurn: boolean
) {
  if (isUndefined(targetPawn) || !isPlayerTurn) {
    return
  }

  socket.emit(
    'movePawn',
    roomId,
    player,
    targetPawn,
    desiredPawnPosition,
    (response: SocketResponse) => {
      handleSocketResponse(errorMessage, response)
    }
  )
}

export function killPawnSocketHanlder(
  socket: Socket,
  roomId: string,
  player: 'player1' | 'player2',
  targetPawn: Pawn | undefined,
  desiredPawnPosition: PawnPosition,
  errorMessage: Ref<string | undefined>,
  isPlayerTurn: boolean
) {
  if (isUndefined(targetPawn) || !isPlayerTurn) {
    return
  }

  socket.emit(
    'killPawn',
    roomId,
    player,
    targetPawn,
    desiredPawnPosition,
    (response: SocketResponse) => {
      handleSocketResponse(errorMessage, response)
    }
  )
}

export function rotatePawnSocketHandler(
  socket: Socket,
  roomId: string,
  player: 'player1' | 'player2',
  targetPawn: Pawn | undefined,
  orientation: 'NW' | 'SE' | 'NE' | 'SW',
  errorMessage: Ref<string | undefined>,
  isPlayerTurn: boolean
) {
  if (isUndefined(targetPawn) || !isPlayerTurn) {
    return
  }

  socket.emit('rotatePawn', roomId, player, targetPawn, orientation, (response: SocketResponse) => {
    handleSocketResponse(errorMessage, response)
  })
}
