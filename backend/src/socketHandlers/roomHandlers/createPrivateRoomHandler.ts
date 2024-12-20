import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import { PlayerRole } from '../../../shared/gameState/entities/PlayerRoleEnum'
import { rooms } from './record/roomRecords'
import emitPlayersInfo from '../utils/room/emitPlayersInfo'
import { RoomType } from '../../../shared/room/entities/RoomTypeEnum'

export default function createPrivateRoomHandler(socket: Socket, io: Server) {
  socket.on('createPrivateRoom', (callback: Callback) => {
    const roomId = socket.id
    rooms[roomId] = {
      type: RoomType.Private,
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
