import { Server } from 'socket.io'
import { gameHandlers } from './gameHandlers/gamesHandlers'
import { leaveRoom, roomHandlers } from './roomHandlers/roomHandlers'

export type Callback = (value: unknown) => void

export default function socketHandlers(io: Server) {
  io.on('connection', (socket) => {
    roomHandlers(socket, io)
    gameHandlers(socket, io)

    socket.on('disconnect', () => {
      leaveRoom(socket, io)
    })
  })
}
