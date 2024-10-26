import { emitPlayerCount } from '../../utils/roomMethods'
import { Player } from '../../../shared/gameState/entities/PlayerEnum'
import { Server, Socket } from 'socket.io'

export default function leaveRoomHandler(
  socket: Socket,
  availablePublicRooms: Record<string, Set<string>>,
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

    for (const roomId in availablePublicRooms) {
      if (availablePublicRooms[roomId].has(socket.id)) {
        delete availablePublicRooms[roomId]
      }
    }
  })
}
