<script setup lang="ts">
import { computed, defineAsyncComponent, onMounted } from 'vue'
import { isDefined, isNotNull, isUndefined } from '@shared/utils/TypeGuard'
import { useUserStore } from '@/composables/user/useUserStore'
import { storeToRefs } from 'pinia'
import Loading from '../shared/Loading.vue'
import router from '@/router'
import AvatarFinder from './AvatarFinder.vue'

const backendUrl = import.meta.env.VITE_BACKEND_URL

const userStore = useUserStore()
const { user, isLoading } = storeToRefs(userStore)

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
  <Loading v-if="isLoading" class="w-5 h-5" />
  <template v-else>
    <a v-if="isUndefined(user)" :href="backendUrl + 'auth/google'">
      <span class="mr-2">Connexion</span><i class="fa-brands fa-google" />
    </a>
    <RouterLink
      v-else
      class="flex items-center space-x-2 bg-dark_light px-3 py-2 rounded-xl cursor-pointer hover:opacity-80"
      :to="{ name: 'my-profile' }"
    >
      <AvatarFinder :avatarId="user.avatarId" class="w-6 h-6" />
      <p class="font-primary_bold">{{ user.pseudo }}</p>
    </RouterLink>
  </template>
</template>
