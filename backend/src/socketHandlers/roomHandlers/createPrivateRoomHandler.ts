import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import { emitPlayerCount } from '../../utils/roomMethods'
import { Room } from './roomHandlers'
import { Player } from '../../../shared/gameState/entities/PlayerEnum'

export default function createPrivateRoomHandler(
  socket: Socket,
  rooms: Record<string, Room>,
  io: Server
) {
  socket.on('createPrivateRoom', (callback: Callback) => {
    const roomId = socket.id
    rooms[roomId] = {
      type: 'private',
      players: [
        {
          socketId: socket.id,
          role: Player.Player1,
          isConnected: false
        }
      ]
    }

    callback(roomId)
    emitPlayerCount(io, rooms, roomId)
  })
}
