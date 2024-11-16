import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import { emitPlayerCount } from '../../utils/roomMethods'
import { isUndefined } from '../../../shared/utils/TypeGuard'
import { Room } from './roomHandlers'
import { Player } from '../../../shared/gameState/entities/PlayerEnum'
import User from '../../../shared/user/entities/User'

export default function searchPublicRoomHandler(
  socket: Socket,
  rooms: Record<string, Room>,
  io: Server
) {
  socket.on('searchPublicRoom', (userId: User['id'], callback: Callback) => {
    const availableRoomId = Object.entries(rooms).find(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, room]) => room.type === 'public' && room.players.length === 1
    )?.[0]

    let roomId: string

    if (isUndefined(availableRoomId)) {
      roomId = socket.id
      rooms[roomId] = {
        type: 'public',
        players: [
          {
            userId: userId,
            socketId: socket.id,
            role: Player.Player1,
            isConnected: false
          }
        ]
      }
    } else {
      roomId = availableRoomId
      rooms[roomId].players.push({
        userId: userId,
        socketId: socket.id,
        role: Player.Player2,
        isConnected: false
      })
    }

    socket.join(roomId)
    callback(roomId)
    emitPlayerCount(io, rooms, roomId)
  })
}
