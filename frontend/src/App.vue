<script setup lang="ts">
import { ref } from 'vue'
import CookieRequester from './components/shared/CookieRequester.vue'
import InfoDisplayer from './components/shared/InfoDisplayer.vue'
import { isNotNull, isUndefined } from '@shared/utils/TypeGuard'
import { getMe } from './utils/api'
import type User from '@shared/user/entities/User'

//Todo faire un composant user
const token = new URLSearchParams(window.location.search).get('token')
if (isNotNull(token)) {
  localStorage.setItem('token', token)

  const url = new URL(window.location.href)
  url.searchParams.delete('token')
  window.history.replaceState({}, '', url.toString())
}

const user = ref<User | undefined>(undefined)
if (isNotNull(localStorage.getItem('token'))) {
  getMe()
    .then((value) => {
      user.value = value
    })
    .catch(() => {
      localStorage.removeItem('token')
    })
}

const backendUrl = import.meta.env.VITE_BACKEND_URL
const message = ref<string | undefined>(import.meta.env.VITE_INFO_MESSAGE)
</script>

<template>
  <RouterLink :to="{ name: 'home' }" class="small-title absolute top-5 left-5">Stratège</RouterLink>
  <a v-if="isUndefined(user)" :href="backendUrl + 'auth/google'" class="absolute top-5 right-5"
    >Se connecter avec Google</a
  >
  <p v-else class="absolute top-5 right-5">Connecté en tant que {{ user.pseudo }}</p>
  <RouterView />
  <CookieRequester />
  <InfoDisplayer v-model="message" />
</template>
