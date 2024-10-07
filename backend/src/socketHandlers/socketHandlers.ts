import { Server } from 'socket.io'
import { gameHandlers } from './gameHandlers/gamesHandlers'
import { roomHandlers } from './roomHandlers/roomHandlers'

export type Callback = (value: unknown) => void

export default function socketHandlers(io: Server) {
  console.log(io)
  io.on('connection', (socket) => {
    console.log(`${socket.id} connected`)
    roomHandlers(socket, io)
    gameHandlers(socket, io)
  })
}
