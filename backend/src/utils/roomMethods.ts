import { Server } from 'socket.io'
import { Room } from 'src/socketHandlers/roomHandlers/roomHandlers'

export function emitPlayerCount(io: Server, rooms: Record<string, Room>, roomId: string) {
  if (rooms[roomId]) {
    let playerCount = 0

    for (const player of rooms[roomId].players) {
      if (player.isConnected) {
        playerCount += 1
      }
    }

    io.to(roomId).emit('playerCount', playerCount)
  }
}
