<script setup lang="ts">
import { io } from 'socket.io-client'
import RoomTypeSelector from '@/components/playview/RoomTypeSelector.vue'
import { isDefined, isUndefined } from '@/helpers/TypeGuard'
import { ref } from 'vue'
import CreatePrivateRoom from '@/components/playview/CreatePrivateRoom.vue'
import { useRoute } from 'vue-router'
import JoinPrivateRoom from '@/components/playview/JoinPrivateRoom.vue'

const route = useRoute()
const roomId = route.query.roomId as string | undefined

const socket = io('http://localhost:3000') // mettre dans un .env
const roomType = ref<'private' | 'public' | undefined>(undefined)
</script>

<template>
  <template v-if="isDefined(roomId)">
    <JoinPrivateRoom v-if="!isUndefined(roomId)" :socket="socket" :roomId="roomId" />
  </template>
  <template v-if="isUndefined(roomId)">
    <RoomTypeSelector v-if="isUndefined(roomType)" v-model="roomType" />
    <CreatePrivateRoom v-if="roomType === 'private'" :socket="socket" />
  </template>
</template>
