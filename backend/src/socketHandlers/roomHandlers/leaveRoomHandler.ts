import { emitPlayersInfo } from '../../utils/roomMethods'
import { Server, Socket } from 'socket.io'
import { Room } from './roomHandlers'
import { isUndefined } from '../../../shared/utils/TypeGuard'

function leaveRoomWithoutRoomId(socket: Socket, rooms: Record<string, Room>, io: Server) {
  for (const roomId in rooms) {
    const playerIndex = rooms[roomId].playersInfo.findIndex(
      (player) => player.socketId === socket.id
    )

    if (playerIndex !== -1) {
      leaveRoom(roomId, socket, rooms, io)
      break
    }
  }
}

function leaveRoom(roomId: string, socket: Socket, rooms: Record<string, Room>, io: Server) {
  if (isUndefined(rooms[roomId])) {
    return
  }

  const playerIndex = rooms[roomId].playersInfo.findIndex((player) => player.socketId === socket.id)

  if (playerIndex !== -1) {
    rooms[roomId].playersInfo[playerIndex].isConnected = false
    emitPlayersInfo(io, rooms, roomId)
  }

  if (!rooms[roomId].playersInfo.find((player) => player.isConnected === true)) {
    delete rooms[roomId]
  }
}

function giveUpGame(roomId: string, socket: Socket, rooms: Record<string, Room>, io: Server) {
  leaveRoom(roomId, socket, rooms, io)
}

export default function leaveRoomHandler(socket: Socket, rooms: Record<string, Room>, io: Server) {
  socket.on('disconnect', () => leaveRoomWithoutRoomId(socket, rooms, io))
  socket.on('leaveRoom', (roomId: string) => leaveRoom(roomId, socket, rooms, io))
  socket.on('giveUpGame', (roomId: string) => giveUpGame(roomId, socket, rooms, io))
}
