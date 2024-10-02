import { emitPlayerCount } from '@/helpers/roomMethods'
import { Player } from '@shared/Enum'
import { Server, Socket } from 'socket.io'

export default function leaveRoomHandler(
  socket: Socket,
  rooms: Record<string, Set<string>>,
  playerRoles: Record<string, Record<string, Player>>,
  io: Server
) {
  socket.on('disconnect', () => {
    for (const roomId in rooms) {
      if (rooms[roomId].has(socket.id)) {
        rooms[roomId].delete(socket.id)

        emitPlayerCount(io, rooms, roomId)

        if (playerRoles[roomId]) {
          delete playerRoles[roomId][socket.id]
        }

        if (rooms[roomId].size === 0) {
          delete rooms[roomId]
          delete playerRoles[roomId]
        }
      }
    }
  })
}
