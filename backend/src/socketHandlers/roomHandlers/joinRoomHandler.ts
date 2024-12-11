import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import { isNull, isUndefined } from '../../../shared/utils/TypeGuard'
import { PlayerRole } from '../../../shared/gameState/entities/PlayerRoleEnum'
import User from '../../../shared/user/entities/User'
import { rooms } from './record/roomRecords'
import emitPlayersInfo from '../utils/room/emitPlayersInfo'
import { createOrRetrieveGame } from '../gameHandlers/record/gameRecords'
import { RoomType } from '../../../shared/room/entities/RoomTypeEnum'

export default function joinRoomHanlder(socket: Socket, io: Server) {
  socket.on('joinRoom', (roomId: string, userId: User['id'] | null, callback: Callback) => {
    if (isUndefined(rooms[roomId])) {
      return callback({ error: 'Cet url ne fonctionne pas' })
    }

    let playerRole: PlayerRole | undefined = undefined

    //Public room
    if (rooms[roomId].type === RoomType.Public) {
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
    if (rooms[roomId].type === RoomType.Private) {
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

    //AI room
    if (rooms[roomId].type === RoomType.AI) {
      const playerIndex = 0
      playerRole = PlayerRole.Player1

      rooms[roomId].playersInfo[playerIndex] = {
        ...rooms[roomId].playersInfo[playerIndex],
        isConnected: true
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
