import { Server } from 'socket.io'
import { createPrivateRoom, joinRoom, leaveRoom } from '@/socketHandlers/roomHandlers'
import { killPawn, movePawn, passTurn, pushPawn, rotatePawn } from './gameHandlers'

export type Callback = (value: unknown) => void

export default function socketHandlers(io: Server) {
  io.on('connection', (socket) => {
    createPrivateRoom(socket, io)
    joinRoom(socket, io)

    passTurn(socket, io)
    movePawn(socket, io)
    killPawn(socket, io)
    pushPawn(socket, io)
    rotatePawn(socket, io)

    socket.on('disconnect', () => {
      leaveRoom(socket, io)
    })
  })
}
