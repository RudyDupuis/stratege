<script setup lang="ts">
import { Socket } from 'socket.io-client'
import { ref } from 'vue'
import PlayerCountInRoom from './shared/PlayerCountInRoom.vue'

const props = defineProps({
  socket: { type: Socket, required: true }
})

const roomId = ref<string | undefined>(undefined)
const shareableLink = ref<string | undefined>(undefined)

function createRoom() {
  props.socket.emit('createPrivateRoom', (id: string) => {
    roomId.value = id
    shareableLink.value = `http://localhost:5173/jouer?roomId=${roomId.value}` // mettre dans un .env
  })
}

createRoom()
</script>

<template>
  <p>Vous avez créé une salle privée avec l'ID : {{ roomId }}</p>
  <p>
    Partagez ce lien : <a :href="shareableLink" target="_blank">{{ shareableLink }}</a>
  </p>
  <PlayerCountInRoom :socket="props.socket" />
</template>
