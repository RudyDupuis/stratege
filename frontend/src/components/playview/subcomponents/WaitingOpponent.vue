<script setup lang="ts">
import ErrorDisplayer from '@/components/shared/ErrorDisplayer.vue'
import { isDefined, isUndefined } from '@shared/utils/TypeGuard'
import { ref } from 'vue'

const props = defineProps<{
  roomType?: string
  roomId: string
}>()

const FRONT_URL = import.meta.env.VITE_FRONT_URL
const shareableLink = `${FRONT_URL}jouer?roomId=${props.roomId}`
const copyStatus = ref<string | undefined>(undefined)
const errorMessage = ref<string | undefined>(undefined)

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copyStatus.value = 'Lien copie !'
    setTimeout(() => {
      copyStatus.value = undefined
    }, 2000)
  } catch (err) {
    errorMessage.value = 'Une erreur est survenue lors de la copie du lien'
  }
}
</script>

<template>
  <div class="flex flex-col items-center">
    <p class="medium-title mb-10">En attente de vote adversaire</p>
    <div class="flex space-x-5 mb-20">
      <div class="w-3 h-3 bg-dark rounded-full animate-bounce"></div>
      <div class="w-3 h-3 bg-dark rounded-full animate-bounce-delay-02"></div>
      <div class="w-3 h-3 bg-dark rounded-full animate-bounce-delay-04"></div>
    </div>
    <button v-if="roomType === 'private'" @click="copyToClipboard(shareableLink)" class="button">
      <i class="fa-solid fa-copy mr-2" />
      {{ isUndefined(copyStatus) ? 'Copier le lien à donner à son ami' : copyStatus }}
    </button>
  </div>
  <ErrorDisplayer v-if="isDefined(errorMessage)" v-model="errorMessage" />
</template>

<style>
@keyframes bounce {
  0% {
    transform: translateY(-5px);
  }
  50% {
    transform: translateY(5px);
  }
  100% {
    transform: translateY(-5px);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}
.animate-bounce-delay-02 {
  animation: bounce 1s infinite 0.2s;
}
.animate-bounce-delay-04 {
  animation: bounce 1s infinite 0.4s;
}
</style>
