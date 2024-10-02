import { Server, Socket } from 'socket.io'
import createPrivateRoomHandler from './createPrivateRoom'
import joinRoomHanlder from './joinRoomHandler'
import { emitPlayerCount } from '@/helpers/roomMethods'

const rooms: Record<string, Set<string>> = {}

export function roomHandlers(socket: Socket, io: Server) {
  createPrivateRoomHandler(socket, rooms, io)
  joinRoomHanlder(socket, rooms, io)
}

export function leaveRoom(socket: Socket, io: Server) {
  for (const roomId in rooms) {
    if (rooms[roomId].has(socket.id)) {
      rooms[roomId].delete(socket.id)

      emitPlayerCount(io, rooms, roomId)

      if (rooms[roomId].size === 0) {
        delete rooms[roomId]
      }
    }
  }
}
