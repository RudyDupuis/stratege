<script setup lang="ts">
import { ref } from 'vue'
import CookieRequester from './components/shared/CookieRequester.vue'
import InfoDisplayer from './components/shared/InfoDisplayer.vue'

const message = ref<string | undefined>(import.meta.env.VITE_INFO_MESSAGE)
</script>

<template>
  <RouterLink :to="{ name: 'home' }" class="small-title absolute top-5 left-5">Stratège</RouterLink>
  <RouterView />
  <CookieRequester />
  <InfoDisplayer v-model="message" />
</template>
