<script setup lang="ts">
import { isDefined } from '@shared/helpers/TypeGuard'
import { Socket } from 'socket.io-client'
import { ref } from 'vue'
import PlayerCountInRoom from './shared/PlayerCountInRoom.vue'
import BoardGame from './shared/BoardGame.vue'

const props = defineProps({
  socket: { type: Socket, required: true },
  roomId: { type: String, required: true }
})

const errorMessage = ref<string | undefined>(undefined)

props.socket.emit('joinRoom', props.roomId, (response: any) => {
  if (response?.error) {
    errorMessage.value = response.error
  }
})
</script>

<template>
  <div v-if="isDefined(errorMessage)">
    <p>{{ errorMessage }}</p>
  </div>
  <div v-else>
    <p>Vous avez rejoint la room avec l'ID : {{ roomId }}</p>
    <PlayerCountInRoom :socket="props.socket" />
    <BoardGame :player="'player2'" :socket="props.socket" />
  </div>
</template>
