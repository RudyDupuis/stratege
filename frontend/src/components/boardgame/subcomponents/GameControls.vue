<script setup lang="ts">
import { handleSocketResponse, type SocketResponse } from '@/utils/socketHelpers'
import { isDefined, isUndefined } from '@shared/utils/TypeGuard'
import { ref } from 'vue'
import ErrorDisplayer from '@/components/shared/ErrorDisplayer.vue'
import type { gameData } from '../BoardGameHandler.vue'

const props = defineProps<{
  gameData: gameData
  resetTarget: () => void
}>()

const errorMessage = ref<string | undefined>(undefined)
const opponentIsNotConnectedErrorMessage = ref<string | undefined>(undefined)

function passTurn() {
  if (!props.gameData.isPlayerTurn) {
    return
  }

  props.gameData.socket.emit(
    'passTurn',
    props.gameData.roomId,
    props.gameData.player,
    (response: SocketResponse) => {
      handleSocketResponse(errorMessage, response)
    }
  )
  props.resetTarget()
}

props.gameData.socket.on('playerCount', (count: number) => {
  if (count === 2) {
    return (opponentIsNotConnectedErrorMessage.value = undefined)
  }

  opponentIsNotConnectedErrorMessage.value = 'Votre adversaire est déconnecté ...'
})
</script>

<template>
  <section
    v-if="isUndefined(gameData.gameState.winner)"
    class="flex flex-col justify-center items-center size-full"
  >
    <p class="medium-title mb-10">
      {{ gameData.isPlayerTurn ? 'A vous de jouer !' : 'Au tour de votre adversaire ...' }}
    </p>

    <section
      v-show="gameData.isPlayerTurn"
      class="flex flex-col justify-center items-center size-full"
    >
      <p class="mb-10">Cliquez et glissez sur l'un de vos pions</p>
      <button @click="passTurn" class="button mb-10">Passer son tour</button>
    </section>
  </section>
  <p v-else class="medium-title size-full mb-20">
    {{
      gameData.gameState.winner === gameData.player ? 'Vous avez gagnez !' : 'Vous avez perdu ...'
    }}
  </p>
  <ErrorDisplayer v-if="isDefined(errorMessage)" v-model="errorMessage" />
  <ErrorDisplayer
    v-if="isDefined(opponentIsNotConnectedErrorMessage)"
    v-model="opponentIsNotConnectedErrorMessage"
  />
</template>
