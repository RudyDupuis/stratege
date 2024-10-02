import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import { isUndefined } from '@shared/helpers/TypeGuard'
import { emitPlayerCount } from '@/helpers/roomMethods'
import { createGame } from '../gameHandlers/gamesHandlers'

export default function joinRoomHanlder(
  socket: Socket,
  rooms: Record<string, Set<string>>,
  io: Server
) {
  socket.on('joinRoom', (roomId: string, callback: Callback) => {
    if (isUndefined(rooms[roomId])) {
      return callback({ error: 'Cet url ne fonctionne pas' })
    }

    if (rooms[roomId].size >= 2) {
      return callback({ error: "Impossible d'avoir plus de deux joueurs dans une partie" })
    }

    socket.join(roomId)
    rooms[roomId].add(socket.id)

    emitPlayerCount(io, rooms, roomId)
    callback(null)

    if (rooms[roomId].size === 2) {
      createGame(roomId, io)
    }
  })
}
