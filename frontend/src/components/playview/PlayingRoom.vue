<script setup lang="ts">
import { isDefined } from '@shared/utils/TypeGuard'
import { Socket } from 'socket.io-client'
import { onUnmounted, ref } from 'vue'
import { Player } from '@shared/gameState/entities/PlayerEnum'
import GameState from '@shared/gameState/entities/GameState'
import { type GameStateDto } from '@shared/gameState/entities/GameStateDto'
import gameStateDtoToEntity from '@shared/gameState/mappers/gameStateMapper'
import ErrorDisplayer from '../shared/ErrorDisplayer.vue'
import WaitingOpponent from './subcomponents/WaitingOpponent.vue'
import BoardGameHandler from '../boardgame/BoardGameHandler.vue'

const props = defineProps<{
  socket: Socket
  roomId: string
  roomType?: string
}>()

const errorMessage = ref<string | undefined>(undefined)
const playerRole = ref<Player | undefined>(undefined)
const gameState = ref<GameState | undefined>(undefined)

props.socket.emit('joinRoom', props.roomId, (response: any) => {
  if (response?.playerRole) {
    playerRole.value = response.playerRole
  }
  if (response?.error) {
    errorMessage.value = response.error
  }
})

props.socket.on('gameState', (state: GameStateDto) => {
  gameState.value = gameStateDtoToEntity(state)
})

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
  />
  <WaitingOpponent v-else :room-type="props.roomType" :room-id="props.roomId" />
  <ErrorDisplayer v-if="isDefined(errorMessage)" v-model="errorMessage" />
</template>
