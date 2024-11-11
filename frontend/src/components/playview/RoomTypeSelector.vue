<script setup lang="ts">
import { useUserStore } from '@/composables/user/useUserStore'
import { isUndefined } from '@shared/utils/TypeGuard'
import { storeToRefs } from 'pinia'

const roomType = defineModel<'private' | 'public' | undefined>()
const user = storeToRefs(useUserStore()).user
</script>

<template>
  <h1 class="large-title mb-14">Quel type de partie ?</h1>
  <button :disabled="isUndefined(user)" class="button" @click="roomType = 'public'">
    Partie classée
  </button>
  <p v-if="isUndefined(user)">Pour jouer en partie classée, vous devez vous connecter.</p>

  <button class="button mt-5" @click="roomType = 'private'">Jouer avec un ami</button>
</template>
