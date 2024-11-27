import { Room } from '../../roomHandlers/record/roomRecords'
import { playerInfoToDto } from '../../../../shared/user/mappers/playerInfoMapper'
import { Server } from 'socket.io'

export default function emitPlayersInfo(io: Server, rooms: Record<string, Room>, roomId: string) {
  if (rooms[roomId]) {
    io.to(roomId).emit(
      'playersInfo',
      rooms[roomId].playersInfo.map((playerInfo) => playerInfoToDto(playerInfo))
    )
  }
}
