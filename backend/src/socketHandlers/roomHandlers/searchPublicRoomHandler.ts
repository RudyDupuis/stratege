import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import { isUndefined } from '../../../shared/utils/TypeGuard'
import { PlayerRole } from '../../../shared/gameState/entities/PlayerRoleEnum'
import User from '../../../shared/user/entities/User'
import { rooms } from './record/roomRecords'
import emitPlayersInfo from '../utils/room/emitPlayersInfo'

export default function searchPublicRoomHandler(socket: Socket, io: Server) {
  socket.on('searchPublicRoom', (userId: User['id'], callback: Callback) => {
    const availableRoomId = Object.entries(rooms).find(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, room]) => room.type === 'public' && room.playersInfo.length === 1
    )?.[0]

    let roomId: string

    if (isUndefined(availableRoomId)) {
      roomId = socket.id
      rooms[roomId] = {
        type: 'public',
        playersInfo: [
          {
            userId: userId,
            socketId: socket.id,
            role: PlayerRole.Player1,
            isConnected: false
          }
        ]
      }
    } else {
      roomId = availableRoomId
      rooms[roomId].playersInfo.push({
        userId: userId,
        socketId: socket.id,
        role: PlayerRole.Player2,
        isConnected: false
      })
    }

    socket.join(roomId)
    callback(roomId)
    emitPlayersInfo(io, rooms, roomId)
  })
}
