import { emitPlayerCount } from '@/helpers/roomMethods'
import { Server, Socket } from 'socket.io'

export default function leaveRoomHandler(
  socket: Socket,
  rooms: Record<string, Set<string>>,
  io: Server
) {
  socket.on('disconnect', () => {
    for (const roomId in rooms) {
      if (rooms[roomId].has(socket.id)) {
        rooms[roomId].delete(socket.id)

        emitPlayerCount(io, rooms, roomId)

        if (rooms[roomId].size === 0) {
          delete rooms[roomId]
        }
      }
    }
  })
}
