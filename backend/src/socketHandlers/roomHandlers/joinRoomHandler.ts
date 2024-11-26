import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import { isNull, isUndefined } from '../../../shared/utils/TypeGuard'
import { emitPlayersInfo } from '../../utils/roomMethods'
import { createOrRetrieveGame } from '../gameHandlers/gamesHandlers'
import { PlayerRole } from '../../../shared/gameState/entities/PlayerRoleEnum'
import { Room } from './roomHandlers'
import User from '../../../shared/user/entities/User'

export default function joinRoomHanlder(socket: Socket, rooms: Record<string, Room>, io: Server) {
  socket.on('joinRoom', (roomId: string, userId: User['id'] | null, callback: Callback) => {
    if (isUndefined(rooms[roomId])) {
      return callback({ error: 'Cet url ne fonctionne pas' })
    }

    let playerRole: PlayerRole | undefined = undefined

    //Public room
    if (rooms[roomId].type === 'public') {
      if (isNull(userId)) {
        return callback({ error: 'Vous devez vous connecter pour jouer en partie classée' })
      }

      const playerIndex = rooms[roomId].playersInfo.findIndex((player) => player.userId === userId)

      if (playerIndex === -1) {
        return callback({ error: "Vous n'êtes pas dans cette partie" })
      }

      rooms[roomId].playersInfo[playerIndex] = {
        ...rooms[roomId].playersInfo[playerIndex],
        socketId: socket.id,
        isConnected: true
      }

      playerRole = rooms[roomId].playersInfo[playerIndex].role
      socket.join(roomId)
    }

    //Private room
    if (rooms[roomId].type === 'private') {
      const playerIndex = rooms[roomId].playersInfo.findIndex(
        (player) => player.socketId === socket.id
      )

      if (playerIndex !== -1) {
        rooms[roomId].playersInfo[playerIndex] = {
          ...rooms[roomId].playersInfo[playerIndex],
          isConnected: true
        }

        playerRole = rooms[roomId].playersInfo[playerIndex].role
      }

      if (playerIndex === -1 && rooms[roomId].playersInfo.length === 2) {
        const unconnectedPlayerIndex = rooms[roomId].playersInfo.findIndex(
          (player) => !player.isConnected
        )

        if (unconnectedPlayerIndex === -1) {
          return callback({ error: "Impossible d'avoir plus de deux joueurs dans une partie" })
        }

        rooms[roomId].playersInfo[unconnectedPlayerIndex] = {
          ...rooms[roomId].playersInfo[unconnectedPlayerIndex],
          socketId: socket.id,
          isConnected: true
        }

        playerRole = rooms[roomId].playersInfo[unconnectedPlayerIndex].role
      }

      if (playerIndex === -1 && rooms[roomId].playersInfo.length === 1) {
        rooms[roomId].playersInfo.push({
          socketId: socket.id,
          role: PlayerRole.Player2,
          isConnected: true
        })

        playerRole = PlayerRole.Player2
      }

      socket.join(roomId)
    }

    callback({ playerRole: playerRole })
    emitPlayersInfo(io, rooms, roomId)

    if (rooms[roomId].playersInfo.length === 2) {
      createOrRetrieveGame(roomId, io, callback)
    }
  })
}
