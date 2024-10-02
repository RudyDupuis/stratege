import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import { emitPlayerCount } from '@/helpers/roomMethods'
import { isUndefined } from '@shared/helpers/TypeGuard'

export default function searchPublicRoomHandler(
  socket: Socket,
  availablePublicRooms: Record<string, Set<string>>,
  rooms: Record<string, Set<string>>,
  io: Server
) {
  socket.on('searchPublicRoom', (callback: Callback) => {
    let roomId: string | undefined = undefined

    for (const [id, players] of Object.entries(availablePublicRooms)) {
      if (players.size === 1) {
        roomId = id
        delete availablePublicRooms[roomId]
        break
      }
    }

    if (isUndefined(roomId)) {
      roomId = socket.id
      rooms[roomId] = new Set()
      availablePublicRooms[roomId] = new Set()

      socket.join(roomId)
      availablePublicRooms[roomId].add(socket.id)
    }

    callback(roomId)
    emitPlayerCount(io, rooms, roomId)
  })
}
