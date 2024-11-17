import PlayerInfo from '../entities/PlayerInfo'
import type PlayerInfoDto from '../entities/PlayerInfoDto'

export function playerInfoDtoToEntity(playerInfoDto: PlayerInfoDto) {
  return new PlayerInfo(
    playerInfoDto.role,
    playerInfoDto.isConnected,
    playerInfoDto.userId,
    playerInfoDto.socketId
  )
}

export function playerInfoToDto(playerInfo: PlayerInfo): PlayerInfoDto {
  return {
    role: playerInfo.role,
    isConnected: playerInfo.isConnected,
    userId: playerInfo.userId,
    socketId: playerInfo.socketId
  }
}
