import { AiLevel } from '../../../../shared/room/entities/AiLevelEnum'
import { RoomType } from '../../../../shared/room/entities/RoomTypeEnum'
import PlayerInfo from '../../../../shared/user/entities/PlayerInfo'

export interface Room {
  type: RoomType
  playersInfo: PlayerInfo[]
  aiLevel?: AiLevel
}

export const rooms: Record<string, Room> = {}

export function deleteRoom(roomId: string) {
  delete rooms[roomId]
}
