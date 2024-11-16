import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import { emitPlayersInfo } from '../../utils/roomMethods'
import { isUndefined } from '../../../shared/utils/TypeGuard'
import { Room } from './roomHandlers'
import { PlayerRole } from '../../../shared/gameState/entities/PlayerRoleEnum'
import User from '../../../shared/user/entities/User'

export default function searchPublicRoomHandler(
  socket: Socket,
  rooms: Record<string, Room>,
  io: Server
) {
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
