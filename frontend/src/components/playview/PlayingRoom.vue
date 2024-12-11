<script setup lang="ts">
import { isDefined } from '@shared/utils/TypeGuard'
import { Socket } from 'socket.io-client'
import { onUnmounted, provide, ref, watch, type Ref } from 'vue'
import { PlayerRole } from '@shared/gameState/entities/PlayerRoleEnum'
import GameState from '@shared/gameState/entities/GameState'
import type GameStateDto from '@shared/gameState/entities/GameStateDto'
import gameStateDtoToEntity from '@shared/gameState/mappers/gameStateMapper'
import WaitingOpponent from './WaitingOpponent.vue'
import BoardGameHandler from '../boardgame/BoardGameHandler.vue'
import type User from '@shared/user/entities/User'
import type PlayerInfo from '@shared/user/entities/PlayerInfo'
import type PlayerInfoDto from '@shared/user/entities/PlayerInfoDto'
import { playerInfoDtoToEntity } from '@shared/user/mappers/playerInfoMapper'
import { requiredInject } from '@/utils/requiredInject'
import type EndGameInformation from '@shared/gameState/entities/EndGameInformation'
import { endGameInformationDtoToEntity } from '@shared/gameState/mappers/endGameInformationMapper'
import type EndGameInformationDto from '@shared/gameState/entities/EndGameInformationDto'
import { ErrorToDisplay, useErrorsStore } from '@/composables/error/useErrorsStore'

const props = defineProps<{
  userId?: User['id']
}>()

const roomId = requiredInject<Ref<string | undefined>>('roomId')
const socket = requiredInject<Socket>('socket')

const gameState = ref<GameState | undefined>(undefined)
socket.on('gameState', (state: GameStateDto) => {
  gameState.value = gameStateDtoToEntity(state)
})
provide('gameState', gameState)

const playersInfo = ref<PlayerInfo[]>([])
socket.on('playersInfo', (playersInfoDto: PlayerInfoDto[]) => {
  playersInfo.value = playersInfoDto.map((playerInfoDto) => playerInfoDtoToEntity(playerInfoDto))
})
provide('playersInfo', playersInfo)

const playerRole = ref<PlayerRole | undefined>(undefined)
provide('playerRole', playerRole)

const endGameInformation = ref<EndGameInformation | undefined>(undefined)
socket.on('endGameInformation', (endGameInformationDto: EndGameInformationDto) => {
  endGameInformation.value = endGameInformationDtoToEntity(endGameInformationDto)
})
provide('endGameInformation', endGameInformation)

watch(
  () => props.userId,
  () => {
    socket.emit('joinRoom', roomId.value, props.userId, (response: any) => {
      if (response?.playerRole) {
        playerRole.value = response.playerRole
      }
      if (response?.error) {
        useErrorsStore().addError(new ErrorToDisplay(response.error))
      }
    })
  },
  { immediate: true }
)

onUnmounted(() => {
  socket.emit('leaveRoom', roomId.value)
})
</script>

<template>
  <BoardGameHandler v-if="isDefined(gameState) && isDefined(playerRole)" />
  <WaitingOpponent v-else />
</template>
