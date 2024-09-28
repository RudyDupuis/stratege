import { Server, Socket } from 'socket.io'
import { isUndefined } from '@shared/helpers/TypeGuard'

const rooms: Record<string, Set<string>> = {}
type Callback = (value: unknown) => void

export function createPrivateRoom(socket: Socket, io: Server) {
  socket.on('createPrivateRoom', (callback: Callback) => {
    const roomId = socket.id
    socket.join(roomId)

    rooms[roomId] = new Set()
    rooms[roomId].add(socket.id)

    console.log(`Room créée: ${roomId}`)

    callback(roomId)
    emitPlayerCount(io, roomId)
  })
}

export function joinRoom(socket: Socket, io: Server) {
  socket.on('joinRoom', (roomId: string, callback: Callback) => {
    if (isUndefined(rooms[roomId])) {
      console.log(`Room ${roomId} non trouvée`)
      return callback({ error: 'Cet url ne fonctionne pas' })
    }

    if (rooms[roomId].size >= 2) {
      console.log(`Room ${roomId} est pleine`)
      return callback({ error: "Impossible d'avoir plus de deux joueurs dans une partie" })
    }

    socket.join(roomId)
    rooms[roomId].add(socket.id)

    console.log(`Un joueur a rejoint la room: ${roomId}`)

    emitPlayerCount(io, roomId)
    callback(null)
  })
}

export function leaveRoom(socket: Socket, io: Server) {
  for (const roomId in rooms) {
    if (rooms[roomId].has(socket.id)) {
      rooms[roomId].delete(socket.id)

      console.log(`Joueur ${socket.id} a quitté la room: ${roomId}`)

      emitPlayerCount(io, roomId)

      if (rooms[roomId].size === 0) {
        delete rooms[roomId]
        console.log(`Room ${roomId} supprimée car elle est vide`)
      }
    }
  }
}

function emitPlayerCount(io: Server, roomId: string) {
  if (rooms[roomId]) {
    io.to(roomId).emit('playerCount', rooms[roomId].size)
  }
}
