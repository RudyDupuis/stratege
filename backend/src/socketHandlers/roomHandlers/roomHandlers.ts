import { Server, Socket } from 'socket.io'
import createPrivateRoomHandler from './createPrivateRoomHandler'
import searchPublicRoomHandler from './searchPublicRoomHandler'
import joinRoomHanlder from './joinRoomHandler'
import leaveRoomHandler from './leaveRoomHandler'
import { Player } from '../../../shared/gameState/entities/PlayerEnum'

export interface Room {
  type: 'private' | 'public'
  players: RoomPlayer[]
}

export interface RoomPlayer {
  userId?: string
  socketId?: string
  role: Player
  isConnected: boolean
}

const rooms: Record<string, Room> = {}

export function roomHandlers(socket: Socket, io: Server) {
  createPrivateRoomHandler(socket, rooms, io)
  searchPublicRoomHandler(socket, rooms, io)
  joinRoomHanlder(socket, rooms, io)
  leaveRoomHandler(socket, rooms, io)
}
