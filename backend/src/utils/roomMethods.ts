import { Server } from 'socket.io'
import { Room } from 'src/socketHandlers/roomHandlers/roomHandlers'

export function emitPlayersInfo(io: Server, rooms: Record<string, Room>, roomId: string) {
  if (rooms[roomId]) {
    io.to(roomId).emit('playersInfo', rooms[roomId].playersInfo)
  }
}
