import { emitPlayerCount } from '../../utils/roomMethods'
import { Server, Socket } from 'socket.io'
import { Room } from './roomHandlers'

export default function leaveRoomHandler(socket: Socket, rooms: Record<string, Room>, io: Server) {
  socket.on('disconnect', () => {
    for (const roomId in rooms) {
      const playerIndex = rooms[roomId].players.findIndex((player) => player.socketId === socket.id)

      if (playerIndex !== -1) {
        rooms[roomId].players[playerIndex].isConnected = false
        emitPlayerCount(io, rooms, roomId)
      }

      if (!rooms[roomId].players.find((player) => player.isConnected === true)) {
        delete rooms[roomId]
      }
    }
  })
}
