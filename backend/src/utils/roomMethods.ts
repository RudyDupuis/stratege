import { playerInfoToDto } from '../../shared/user/mappers/playerInfoMapper'
import { Server } from 'socket.io'
import { Room } from '../socketHandlers/roomHandlers/roomHandlers'

export function emitPlayersInfo(io: Server, rooms: Record<string, Room>, roomId: string) {
  if (rooms[roomId]) {
    io.to(roomId).emit(
      'playersInfo',
      rooms[roomId].playersInfo.map((playerInfo) => playerInfoToDto(playerInfo))
    )
  }
}
