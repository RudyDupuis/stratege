import { Server, Socket } from 'socket.io'
import { isUndefined } from '@shared/helpers/TypeGuard'
import { createGame } from './gameHandlers'
import { Callback } from '.'

const rooms: Record<string, Set<string>> = {}

export function createPrivateRoom(socket: Socket, io: Server) {
  socket.on('createPrivateRoom', (callback: Callback) => {
    const roomId = socket.id
    socket.join(roomId)

    rooms[roomId] = new Set()
    rooms[roomId].add(socket.id)

    callback(roomId)
    emitPlayerCount(io, roomId)
  })
}

export function joinRoom(socket: Socket, io: Server) {
  socket.on('joinRoom', (roomId: string, callback: Callback) => {
    if (isUndefined(rooms[roomId])) {
      return callback({ error: 'Cet url ne fonctionne pas' })
    }

    if (rooms[roomId].size >= 2) {
      return callback({ error: "Impossible d'avoir plus de deux joueurs dans une partie" })
    }

    socket.join(roomId)
    rooms[roomId].add(socket.id)

    emitPlayerCount(io, roomId)
    callback(null)

    if (rooms[roomId].size === 2) {
      createGame(roomId, io)
    }
  })
}

export function leaveRoom(socket: Socket, io: Server) {
  for (const roomId in rooms) {
    if (rooms[roomId].has(socket.id)) {
      rooms[roomId].delete(socket.id)

      emitPlayerCount(io, roomId)

      if (rooms[roomId].size === 0) {
        delete rooms[roomId]
      }
    }
  }
}

function emitPlayerCount(io: Server, roomId: string) {
  if (rooms[roomId]) {
    io.to(roomId).emit('playerCount', rooms[roomId].size)
  }
}
