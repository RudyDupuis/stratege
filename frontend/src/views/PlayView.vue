<script setup lang="ts">
import { io } from 'socket.io-client'
import RoomTypeSelector from '@/components/playview/RoomTypeSelector.vue'
import { isDefined } from '@shared/utils/TypeGuard'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PlayingRoom from '@/components/playview/PlayingRoom.vue'

const FRONT_URL = import.meta.env.VITE_FRONT_URL
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL

const socket = io(SOCKET_URL)
const route = useRoute()
const roomId = ref<string | undefined>(route.query.roomId as string | undefined)

const roomType = ref<'private' | 'public' | undefined>(undefined)

function getRoomIdAndChangeURL(id: string) {
  roomId.value = id
  window.history.pushState({}, '', `${FRONT_URL}jouer?roomId=${id}`)
}

watch(roomType, () => {
  if (roomType.value === 'private') {
    socket.emit('createPrivateRoom', (id: string) => {
      getRoomIdAndChangeURL(id)
    })
  }
  if (roomType.value === 'public') {
    socket.emit('searchPublicRoom', (id: string) => {
      getRoomIdAndChangeURL(id)
    })
  }
})
</script>

<template>
  <main>
    <PlayingRoom v-if="isDefined(roomId)" :socket="socket" :roomId="roomId" :room-type="roomType" />
    <RoomTypeSelector v-else v-model="roomType" />
  </main>
</template>
