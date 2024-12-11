import { Server, Socket } from 'socket.io'
import { Callback } from '../socketHandlers'
import { rooms } from './record/roomRecords'
import { PlayerRole } from '../../../shared/gameState/entities/PlayerRoleEnum'
import emitPlayersInfo from '../utils/room/emitPlayersInfo'

export default function createAIRoomHandler(socket: Socket, io: Server) {
  socket.on('createAiRoom', (aiLevel: 'easy' | 'medium' | 'hard', callback: Callback) => {
    const roomId = socket.id
    rooms[roomId] = {
      type: 'ai',
      playersInfo: [
        {
          socketId: socket.id,
          role: PlayerRole.Player1,
          isConnected: false
        },
        {
          role: PlayerRole.Player2,
          isConnected: true
        }
      ],
      aiLevel
    }

    callback(roomId)
    emitPlayersInfo(io, rooms, roomId)
  })
}
