import { Server } from 'socket.io'

export function emitPlayerCount(io: Server, rooms: Record<string, Set<string>>, roomId: string) {
  if (rooms[roomId]) {
    io.to(roomId).emit('playerCount', rooms[roomId].size)
  }
}
