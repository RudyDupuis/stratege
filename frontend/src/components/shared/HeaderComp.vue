<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import UserLogin from '../user/UserLogin.vue'
import { SoundManager } from '@/utils/soundManager'

const route = useRoute()
const soundManager = SoundManager.getInstance()
const isInGame = computed(() => {
  return route.path.startsWith('/jouer') && route.query.roomId !== undefined
})
</script>
<template>
  <header
    v-if="!isInGame"
    class="z-30 p-5 fixed top-0 left-0 flex items-center justify-between w-full bg-light"
  >
    <RouterLink :to="{ name: 'home' }" class="small-title"> Stratège </RouterLink>
    <UserLogin />
  </header>
  <button
    class="fixed z-30 right-0 bg-dark_light p-2 rounded-l-xl hover:opacity-50"
    :class="{ 'top-5': isInGame, 'top-20': !isInGame }"
    @click="soundManager.toggleMuteSwitch()"
  >
    <i v-if="!soundManager.getIsMuted()" class="fa-solid fa-volume-high"></i>
    <i v-if="soundManager.getIsMuted()" class="fa-solid fa-volume-xmark"></i>
  </button>
</template>
