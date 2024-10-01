import type { Pawn } from '@shared/entities/Pawn'
import type { PawnPosition } from '@shared/entities/PawnPosition'
import type { Orientation, Player } from '@shared/Enum'
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
  player: Player,
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
  player: Player,
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
  player: Player,
  targetPawn: Pawn | undefined,
  desiredPawnPositionForKill: PawnPosition,
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
    desiredPawnPositionForKill,
    (response: SocketResponse) => {
      handleSocketResponse(errorMessage, response)
    }
  )
}

export function pushPawnSocketHandler(
  socket: Socket,
  roomId: string,
  player: Player,
  targetPawn: Pawn | undefined,
  desiredPushedPawnPosition: PawnPosition,
  errorMessage: Ref<string | undefined>,
  isPlayerTurn: boolean
) {
  if (isUndefined(targetPawn) || !isPlayerTurn) {
    return
  }

  socket.emit(
    'pushPawn',
    roomId,
    player,
    targetPawn,
    desiredPushedPawnPosition,
    (response: SocketResponse) => {
      handleSocketResponse(errorMessage, response)
    }
  )
}

export function rotatePawnSocketHandler(
  socket: Socket,
  roomId: string,
  player: Player,
  targetPawn: Pawn | undefined,
  orientation: Orientation,
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
