<script setup lang="ts">
import { ErrorToDisplay, useErrorsStore } from '@/composables/error/useErrorsStore'
import { requiredInject } from '@/utils/requiredInject'
import { RoomType } from '@shared/room/entities/RoomTypeEnum'
import { isUndefined } from '@shared/utils/TypeGuard'
import { ref, type Ref } from 'vue'

const roomType = requiredInject<Ref<RoomType>>('roomType')
const roomId = requiredInject<Ref<string | undefined>>('roomId')

const FRONT_URL = import.meta.env.VITE_FRONT_URL
const shareableLink = `${FRONT_URL}jouer?roomId=${roomId.value}`
const copyStatus = ref<string | undefined>(undefined)

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    copyStatus.value = 'Lien copie !'
    setTimeout(() => {
      copyStatus.value = undefined
    }, 2000)
  } catch (err) {
    useErrorsStore().addError(
      new ErrorToDisplay('Une erreur est survenue lors de la copie du lien')
    )
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
    <button
      v-button-click-sound
      v-if="roomType === RoomType.Private"
      @click="copyToClipboard(shareableLink)"
      class="button mb-5"
    >
      <i class="fa-solid fa-copy mr-2" />
      {{ isUndefined(copyStatus) ? 'Copier le lien à donner à son ami' : copyStatus }}
    </button>
    <RouterLink v-button-click-sound :to="{ name: 'home' }" class="danger-button">
      <i class="fa-solid fa-home mr-2" />
      Retourner au menu
    </RouterLink>
  </div>
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
