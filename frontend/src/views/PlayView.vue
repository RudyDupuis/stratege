<script setup lang="ts">
import { io } from 'socket.io-client'
import RoomTypeSelector from '@/components/playview/RoomTypeSelector.vue'
import { isDefined, isUndefined } from '@shared/utils/TypeGuard'
import { provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import PlayingRoom from '@/components/playview/PlayingRoom.vue'
import router from '@/router'
import { useUserStore } from '@/composables/user/useUserStore'
import { storeToRefs } from 'pinia'
import { ErrorToDisplay, useErrorsStore } from '@/composables/error/useErrorsStore'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL
const user = storeToRefs(useUserStore()).user

const socket = io(SOCKET_URL)
provide('socket', socket)

const route = useRoute()
const roomId = ref<string | undefined>(route.query.roomId as string | undefined)
provide('roomId', roomId)

const roomType = ref<'private' | 'public' | 'ai' | undefined>(undefined)

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
      useErrorsStore().addError(
        new ErrorToDisplay('Vous devez vous connecter pour jouer en partie classée')
      )
      return
    }
    socket.emit('searchPublicRoom', user.value.id, (id: string) => {
      getRoomIdAndChangeURL(id)
    })
  }
  if (roomType.value === 'ai') {
    socket.emit('createAiRoom', (id: string) => {
      getRoomIdAndChangeURL(id)
    })
  }
})
</script>

<template>
  <main>
    <PlayingRoom v-if="isDefined(roomId)" :room-type="roomType" :userId="user?.id" />
    <RoomTypeSelector v-else v-model="roomType" />
  </main>
</template>
