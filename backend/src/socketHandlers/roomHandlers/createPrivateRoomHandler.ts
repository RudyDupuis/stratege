import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import { emitPlayerCount } from '@/helpers/roomMethods'

export default function createPrivateRoomHandler(
  socket: Socket,
  rooms: Record<string, Set<string>>,
  io: Server
) {
  socket.on('createPrivateRoom', (callback: Callback) => {
    const roomId = socket.id
    rooms[roomId] = new Set()

    callback(roomId)
    emitPlayerCount(io, rooms, roomId)
  })
}
