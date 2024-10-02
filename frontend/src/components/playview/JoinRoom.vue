<script setup lang="ts">
import { isDefined } from '@shared/helpers/TypeGuard'
import { Socket } from 'socket.io-client'
import { ref } from 'vue'
import PlayerCountInRoom from './shared/PlayerCountInRoom.vue'
import BoardGame from './shared/BoardGame.vue'
import { Player } from '@shared/Enum'
import { GameState, type GameStateDto } from '@shared/entities/GameState'
import { gameStateDtoToEntity } from '@shared/helpers/Mapper'

const props = defineProps({
  socket: { type: Socket, required: true },
  roomId: { type: String, required: true },
  roomType: { type: String }
})

const shareableLink = `http://localhost:5173/jouer?roomId=${props.roomId}`
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
  <div v-if="isDefined(errorMessage)">
    <p>{{ errorMessage }}</p>
  </div>
  <div v-else>
    <p v-if="roomType === 'private'">
      Partagez ce lien : <a :href="shareableLink" target="_blank">{{ shareableLink }}</a>
    </p>
    <PlayerCountInRoom :socket="props.socket" />
    <BoardGame
      v-if="isDefined(gameState) && isDefined(playerRole)"
      :room-id="props.roomId"
      :socket="props.socket"
      :player="playerRole"
      :game-state="gameState"
    />
  </div>
</template>
