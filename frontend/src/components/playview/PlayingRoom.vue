<script setup lang="ts">
import { isDefined } from '@shared/utils/TypeGuard'
import { Socket } from 'socket.io-client'
import { onUnmounted, ref, watch } from 'vue'
import { PlayerRole } from '@shared/gameState/entities/PlayerRoleEnum'
import GameState from '@shared/gameState/entities/GameState'
import type GameStateDto from '@shared/gameState/entities/GameStateDto'
import gameStateDtoToEntity from '@shared/gameState/mappers/gameStateMapper'
import ErrorDisplayer from '../shared/ErrorDisplayer.vue'
import WaitingOpponent from './subcomponents/WaitingOpponent.vue'
import BoardGameHandler from '../boardgame/BoardGameHandler.vue'
import type User from '@shared/user/entities/User'
import type PlayerInfoDto from '@shared/user/entities/PlayerDto'

const props = defineProps<{
  socket: Socket
  roomId: string
  roomType?: string
  userId?: User['id']
}>()

const errorMessage = ref<string | undefined>(undefined)
const playerRole = ref<PlayerRole | undefined>(undefined)
const gameState = ref<GameState | undefined>(undefined)
const playersInfo = ref<PlayerInfoDto[]>([])

props.socket.on('gameState', (state: GameStateDto) => {
  gameState.value = gameStateDtoToEntity(state)
})

props.socket.on('playersInfo', (fetchedPlayersInfo: PlayerInfoDto[]) => {
  playersInfo.value = fetchedPlayersInfo
})

watch(
  () => props.userId,
  () => {
    props.socket.emit('joinRoom', props.roomId, props.userId, (response: any) => {
      if (response?.playerRole) {
        playerRole.value = response.playerRole
      }
      if (response?.error) {
        errorMessage.value = response.error
      }
    })
  },
  { immediate: true }
)

onUnmounted(() => {
  props.socket.emit('leaveSearchRoom')
})
</script>

<template>
  <BoardGameHandler
    v-if="isDefined(gameState) && isDefined(playerRole)"
    :room-id="props.roomId"
    :socket="props.socket"
    :player="playerRole"
    :game-state="gameState"
    :players-info="playersInfo"
  />
  <WaitingOpponent v-else :room-type="props.roomType" :room-id="props.roomId" />
  <ErrorDisplayer v-if="isDefined(errorMessage)" v-model="errorMessage" />
</template>
