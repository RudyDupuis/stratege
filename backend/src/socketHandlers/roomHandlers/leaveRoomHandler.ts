import { emitPlayersInfo } from '../../utils/roomMethods'
import { Server, Socket } from 'socket.io'
import { Room } from './roomHandlers'

export default function leaveRoomHandler(socket: Socket, rooms: Record<string, Room>, io: Server) {
  socket.on('disconnect', () => {
    for (const roomId in rooms) {
      const playerIndex = rooms[roomId].playersInfo.findIndex(
        (player) => player.socketId === socket.id
      )

      if (playerIndex !== -1) {
        rooms[roomId].playersInfo[playerIndex].isConnected = false
        emitPlayersInfo(io, rooms, roomId)
      }

      if (!rooms[roomId].playersInfo.find((player) => player.isConnected === true)) {
        delete rooms[roomId]
      }
    }
  })
}
