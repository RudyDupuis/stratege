import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import { isUndefined } from '@shared/helpers/TypeGuard'
import { emitPlayerCount } from '@/helpers/roomMethods'
import { createOrRetrieveGame } from '../gameHandlers/gamesHandlers'
import { Player } from '@shared/Enum'

export default function joinRoomHanlder(
  socket: Socket,
  rooms: Record<string, Set<string>>,
  playerRoles: Record<string, Record<string, Player>>,
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

    if (!playerRoles[roomId]) {
      playerRoles[roomId] = {}
    }

    if (!playerRoles[roomId][socket.id]) {
      const rolesInRoom = Object.values(playerRoles[roomId])

      if (!rolesInRoom.includes(Player.Player1)) {
        playerRoles[roomId][socket.id] = Player.Player1
      } else {
        playerRoles[roomId][socket.id] = Player.Player2
      }
    }

    callback({ playerRole: playerRoles[roomId][socket.id] })
    emitPlayerCount(io, rooms, roomId)

    if (rooms[roomId].size === 2) {
      createOrRetrieveGame(roomId, io)
    }
  })
}
