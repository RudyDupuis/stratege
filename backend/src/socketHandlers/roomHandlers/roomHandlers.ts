import { Server, Socket } from 'socket.io'
import createPrivateRoomHandler from './createPrivateRoomHandler'
import searchPublicRoomHandler from './searchPublicRoomHandler'
import joinRoomHanlder from './joinRoomHandler'
import leaveRoomHandler from './leaveRoomHandler'
import { Player } from '@shared/Enum'
import leaveSearchRoomHandler from './leaveSearchRoomHandler'

const rooms: Record<string, Set<string>> = {}
const playerRoles: Record<string, Record<string, Player>> = {}
const availablePublicRooms: Record<string, Set<string>> = {}

export function roomHandlers(socket: Socket, io: Server) {
  createPrivateRoomHandler(socket, rooms, io)
  searchPublicRoomHandler(socket, availablePublicRooms, rooms, io)
  joinRoomHanlder(socket, rooms, playerRoles, io)
  leaveRoomHandler(socket, availablePublicRooms, rooms, playerRoles, io)
  leaveSearchRoomHandler(socket, availablePublicRooms, rooms)
}
