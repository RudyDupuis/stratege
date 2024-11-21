<script setup lang="ts">
import { ref } from 'vue'
import CookieRequester from './components/shared/CookieRequester.vue'
import InfoDisplayer from './components/shared/InfoDisplayer.vue'
import UserLogin from './components/user/UserLogin.vue'

const message = ref<string | undefined>(import.meta.env.VITE_INFO_MESSAGE)
</script>

<template>
  <header class="z-50 p-5 fixed top-0 left-0 flex items-center justify-between w-full bg-light">
    <RouterLink :to="{ name: 'home' }" class="small-title"> Stratège </RouterLink>
    <UserLogin />
  </header>
  <RouterView />
  <CookieRequester />
  <InfoDisplayer v-model="message" />
</template>
