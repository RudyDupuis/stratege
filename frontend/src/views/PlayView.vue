<script setup lang="ts">
import { io } from 'socket.io-client'
import RoomTypeSelector from '@/components/playview/RoomTypeSelector.vue'
import { isDefined, isUndefined } from '@shared/utils/TypeGuard'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PlayingRoom from '@/components/playview/PlayingRoom.vue'
import router from '@/router'
import { useUserStore } from '@/composables/user/useUserStore'
import ErrorDisplayer from '@/components/shared/ErrorDisplayer.vue'
import { storeToRefs } from 'pinia'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL
const errorMessage = ref<string | undefined>(undefined)
const user = storeToRefs(useUserStore()).user

const socket = io(SOCKET_URL)
const route = useRoute()
const roomId = ref<string | undefined>(route.query.roomId as string | undefined)

const roomType = ref<'private' | 'public' | undefined>(undefined)

function getRoomIdAndChangeURL(id: string) {
  roomId.value = id
  router.push({ path: '/jouer', query: { roomId: id } })
}

watch(roomType, () => {
  if (roomType.value === 'private') {
    socket.emit('createPrivateRoom', (id: string) => {
      getRoomIdAndChangeURL(id)
    })
  }
  if (roomType.value === 'public') {
    if (isUndefined(user.value)) {
      errorMessage.value = 'Vous devez vous connecter pour jouer en partie classée'
      return
    }
    socket.emit('searchPublicRoom', user.value.id, (id: string) => {
      getRoomIdAndChangeURL(id)
    })
  }
})
</script>

<template>
  <main>
    <PlayingRoom
      v-if="isDefined(roomId)"
      :socket="socket"
      :roomId="roomId"
      :room-type="roomType"
      :userId="user?.id"
    />
    <RoomTypeSelector v-else v-model="roomType" />
  </main>
  <ErrorDisplayer v-if="isDefined(errorMessage)" v-model="errorMessage" />
</template>
