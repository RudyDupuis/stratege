<script setup lang="ts">
import { isDefined } from '@shared/helpers/TypeGuard'
import { Socket } from 'socket.io-client'
import { ref } from 'vue'
import { Player } from '@shared/Enum'
import { GameState, type GameStateDto } from '@shared/entities/GameState'
import { gameStateDtoToEntity } from '@shared/helpers/Mapper'
import ErrorDisplayer from '../shared/ErrorDisplayer.vue'
import WaitingOpponent from './subcomponents/WaitingOpponent.vue'
import BoardGameHandler from '../boardgame/BoardGameHandler.vue'

//TODO faire en sorte que quand le joueur quitte la page PlayingRoom il soit retiré des availablesPublicRooms
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
