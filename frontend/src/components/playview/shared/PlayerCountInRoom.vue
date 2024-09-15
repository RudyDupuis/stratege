<script setup lang="ts">
import { Socket } from 'socket.io-client'
import { ref } from 'vue'
const props = defineProps({
  socket: { type: Socket, required: true }
})

const playerCount = ref<number>(0)

props.socket.on('playerCount', (count: number) => {
  playerCount.value = count
})
</script>

<template>
  <p>Nombre de joueurs connectés : {{ playerCount }}</p>
</template>
