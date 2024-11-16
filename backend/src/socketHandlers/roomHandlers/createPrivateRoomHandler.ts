import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import { emitPlayersInfo } from '../../utils/roomMethods'
import { Room } from './roomHandlers'
import { PlayerRole } from '../../../shared/gameState/entities/PlayerRoleEnum'

export default function createPrivateRoomHandler(
  socket: Socket,
  rooms: Record<string, Room>,
  io: Server
) {
  socket.on('createPrivateRoom', (callback: Callback) => {
    const roomId = socket.id
    rooms[roomId] = {
      type: 'private',
      playersInfo: [
        {
          socketId: socket.id,
          role: PlayerRole.Player1,
          isConnected: false
        }
      ]
    }

    callback(roomId)
    emitPlayersInfo(io, rooms, roomId)
  })
}
