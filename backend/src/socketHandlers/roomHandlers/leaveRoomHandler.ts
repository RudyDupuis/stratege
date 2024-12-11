import { Server, Socket } from 'socket.io'
import { isUndefined } from '../../../shared/utils/TypeGuard'
import { deleteRoom, rooms } from './record/roomRecords'
import {
  deleteGameGiveUpTimer,
  setGameGiveUpTimer
} from '../gameHandlers/record/gameGiveUpTimerRecord'
import emitPlayersInfo from '../utils/room/emitPlayersInfo'
import { deleteGame } from '../gameHandlers/record/gameRecords'
import { deleteGameTurnTimer } from '../gameHandlers/record/gameTurnTimerRecords'
import { RoomType } from '../../../shared/room/entities/RoomTypeEnum'

function leaveRoom(roomId: string, socket: Socket, io: Server) {
  if (isUndefined(rooms[roomId])) {
    return
  }

  const playerIndex = rooms[roomId].playersInfo.findIndex((player) => player.socketId === socket.id)

  if (playerIndex !== -1) {
    rooms[roomId].playersInfo[playerIndex].isConnected = false
    setGameGiveUpTimer(roomId, rooms[roomId].playersInfo[playerIndex].role, io)
    emitPlayersInfo(io, rooms, roomId)
  }

  if (
    !rooms[roomId].playersInfo.find((player) => player.isConnected === true) ||
    rooms[roomId].type === RoomType.AI
  ) {
    deleteRoom(roomId)
    deleteGame(roomId)
    deleteGameTurnTimer(roomId)
    deleteGameGiveUpTimer(roomId)
  }
}

export default function leaveRoomHandler(socket: Socket, io: Server) {
  socket.on('disconnect', () => {
    for (const roomId in rooms) {
      const playerIndex = rooms[roomId].playersInfo.findIndex(
        (player) => player.socketId === socket.id
      )

      if (playerIndex !== -1) {
        leaveRoom(roomId, socket, io)
        break
      }
    }
  })
  socket.on('leaveRoom', (roomId: string) => leaveRoom(roomId, socket, io))
}
