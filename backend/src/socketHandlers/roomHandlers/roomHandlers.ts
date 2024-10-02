import { Server, Socket } from 'socket.io'
import createPrivateRoomHandler from './createPrivateRoomHandler'
import joinRoomHanlder from './joinRoomHandler'
import leaveRoomHandler from './leaveRoomHandler'
import { Player } from '@shared/Enum'

const rooms: Record<string, Set<string>> = {}
const playerRoles: Record<string, Record<string, Player>> = {}

export function roomHandlers(socket: Socket, io: Server) {
  createPrivateRoomHandler(socket, rooms, io)
  joinRoomHanlder(socket, rooms, playerRoles, io)
  leaveRoomHandler(socket, rooms, playerRoles, io)
}
