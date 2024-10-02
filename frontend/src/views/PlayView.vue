<script setup lang="ts">
import { io } from 'socket.io-client'
import RoomTypeSelector from '@/components/playview/RoomTypeSelector.vue'
import { isDefined, isUndefined } from '@shared/helpers/TypeGuard'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import JoinRoom from '@/components/playview/JoinRoom.vue'

const route = useRoute()
const roomId = ref<string | undefined>(route.query.roomId as string | undefined)

const socket = io('http://localhost:3000') // mettre dans un .env
const roomType = ref<'private' | 'public' | undefined>(undefined)

watch(roomType, () => {
  if (roomType.value === 'private') {
    socket.emit('createPrivateRoom', (id: string) => {
      roomId.value = id
      window.history.pushState({}, '', `http://localhost:5173/jouer?roomId=${id}`) // mettre dans un .env
    })
  }
})
</script>

<template>
  <template v-if="isDefined(roomId)">
    <JoinRoom v-if="!isUndefined(roomId)" :socket="socket" :roomId="roomId" />
  </template>
  <template v-if="isUndefined(roomId)">
    <RoomTypeSelector v-if="isUndefined(roomType)" v-model="roomType" />
  </template>
</template>
