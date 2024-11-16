import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import { isNull, isUndefined } from '../../../shared/utils/TypeGuard'
import { emitPlayerCount } from '../../utils/roomMethods'
import { createOrRetrieveGame } from '../gameHandlers/gamesHandlers'
import { Player } from '../../../shared/gameState/entities/PlayerEnum'
import { Room } from './roomHandlers'
import User from '../../../shared/user/entities/User'

export default function joinRoomHanlder(socket: Socket, rooms: Record<string, Room>, io: Server) {
  socket.on('joinRoom', (roomId: string, userId: User['id'] | null, callback: Callback) => {
    if (isUndefined(rooms[roomId])) {
      return callback({ error: 'Cet url ne fonctionne pas' })
    }

    let playerRole: Player | undefined = undefined

    //Public room
    if (rooms[roomId].type === 'public') {
      if (isNull(userId)) {
        return callback({ error: 'Vous devez vous connecter pour jouer en partie classée' })
      }

      const playerIndex = rooms[roomId].players.findIndex((player) => player.userId === userId)

      if (playerIndex === -1) {
        return callback({ error: "Vous n'êtes pas dans cette partie" })
      }

      rooms[roomId].players[playerIndex] = {
        ...rooms[roomId].players[playerIndex],
        socketId: socket.id,
        isConnected: true
      }

      playerRole = rooms[roomId].players[playerIndex].role
      socket.join(roomId)
    }

    //Private room
    if (rooms[roomId].type === 'private') {
      const playerIndex = rooms[roomId].players.findIndex((player) => player.socketId === socket.id)

      if (playerIndex !== -1) {
        rooms[roomId].players[playerIndex] = {
          ...rooms[roomId].players[playerIndex],
          isConnected: true
        }

        playerRole = rooms[roomId].players[playerIndex].role
      }

      if (playerIndex === -1 && rooms[roomId].players.length === 2) {
        const unconnectedPlayerIndex = rooms[roomId].players.findIndex(
          (player) => !player.isConnected
        )

        if (unconnectedPlayerIndex === -1) {
          return callback({ error: "Impossible d'avoir plus de deux joueurs dans une partie" })
        }

        rooms[roomId].players[unconnectedPlayerIndex] = {
          ...rooms[roomId].players[unconnectedPlayerIndex],
          socketId: socket.id,
          isConnected: true
        }

        playerRole = rooms[roomId].players[unconnectedPlayerIndex].role
      }

      if (playerIndex === -1 && rooms[roomId].players.length === 1) {
        rooms[roomId].players.push({
          socketId: socket.id,
          role: Player.Player2,
          isConnected: true
        })

        playerRole = Player.Player2
      }

      socket.join(roomId)
    }

    callback({ playerRole: playerRole })
    emitPlayerCount(io, rooms, roomId)

    if (rooms[roomId].players.length === 2) {
      createOrRetrieveGame(roomId, io)
    }
  })
}
