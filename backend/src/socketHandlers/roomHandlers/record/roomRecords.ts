import PlayerInfo from '../../../../shared/user/entities/PlayerInfo'

export interface Room {
  type: 'private' | 'public' | 'ai'
  playersInfo: PlayerInfo[]
}

export const rooms: Record<string, Room> = {}

export function deleteRoom(roomId: string) {
  delete rooms[roomId]
}
