<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { isDefined, isNotNull, isUndefined } from '@shared/utils/TypeGuard'
import { useUserStore } from '@/composables/user/useUserStore'
import ErrorDisplayer from '../shared/ErrorDisplayer.vue'
import { storeToRefs } from 'pinia'
import Loading from '../shared/Loading.vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import AvatarFinder from './AvatarFinder.vue'

const route = useRoute()
const backendUrl = import.meta.env.VITE_BACKEND_URL

const isInGame = computed(() => {
  return route.path.startsWith('/jouer') && route.query.roomId !== undefined
})

const userStore = useUserStore()
const { user, isLoading, errorMessage } = storeToRefs(userStore)

const token = new URLSearchParams(window.location.search).get('token')
if (isNotNull(token)) {
  localStorage.setItem('token', token)
  router.push({ name: 'home' })
}

onMounted(() => {
  userStore.getUser()
})
</script>

<template>
  <template v-if="!isInGame">
    <Loading v-if="isLoading" class="absolute top-5 right-5 w-5 h-5" />
    <template v-else>
      <a v-if="isUndefined(user)" :href="backendUrl + 'auth/google'" class="absolute top-5 right-5">
        Se connecter avec Google
      </a>
      <RouterLink
        v-else
        class="absolute top-5 right-5 flex items-center space-x-2 bg-dark_light px-3 py-2 rounded-xl cursor-pointer hover:opacity-80"
        :to="{ name: 'my-profile' }"
      >
        <AvatarFinder :avatarId="user.avatarId" class="w-6 h-6" />
        <p class="font-primary_bold">{{ user.pseudo }}</p>
      </RouterLink>
    </template>
    <ErrorDisplayer v-if="isDefined(errorMessage)" v-model="errorMessage" />
  </template>
</template>
