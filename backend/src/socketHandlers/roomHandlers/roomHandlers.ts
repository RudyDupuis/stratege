import { Server, Socket } from 'socket.io'
import createPrivateRoomHandler from './createPrivateRoomHandler'
import searchPublicRoomHandler from './searchPublicRoomHandler'
import joinRoomHanlder from './joinRoomHandler'
import leaveRoomHandler from './leaveRoomHandler'

export function roomHandlers(socket: Socket, io: Server) {
  createPrivateRoomHandler(socket, io)
  searchPublicRoomHandler(socket, io)
  joinRoomHanlder(socket, io)
  leaveRoomHandler(socket, io)
}
