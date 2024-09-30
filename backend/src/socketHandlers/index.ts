import { Server } from 'socket.io'
import { createPrivateRoom, joinRoom, leaveRoom } from '@/socketHandlers/roomHandlers'
import { movePawn, passTurn } from './gameHandlers'

export type Callback = (value: unknown) => void

export default function socketHandlers(io: Server) {
  io.on('connection', (socket) => {
    console.log('Un joueur est connecté')

    createPrivateRoom(socket, io)
    joinRoom(socket, io)

    passTurn(socket, io)
    movePawn(socket, io)

    socket.on('disconnect', () => {
      console.log('Un joueur est déconnecté')

      leaveRoom(socket, io)
    })
  })
}
