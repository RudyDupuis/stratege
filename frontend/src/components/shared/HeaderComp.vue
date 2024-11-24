<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import UserLogin from '../user/UserLogin.vue'

const route = useRoute()
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
</template>
