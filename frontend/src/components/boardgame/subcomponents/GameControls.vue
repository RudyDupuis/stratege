<script setup lang="ts">
import { handleSocketResponse, type SocketResponse } from '@/utils/socketHelpers'
import { isDefined, isUndefined } from '@shared/utils/TypeGuard'
import { ref } from 'vue'
import ErrorDisplayer from '@/components/shared/ErrorDisplayer.vue'
import type { gameData } from '../BoardGameHandler.vue'
import type PlayerInfoDto from '@shared/user/entities/PlayerDto'
import { PlayerRole } from '@shared/gameState/entities/PlayerRoleEnum'
import { getUserById } from '@/utils/api'
import type User from '@shared/user/entities/User'
import AvatarFinder from '@/components/user/AvatarFinder.vue'
import PawnComponent from './PawnComponent.vue'

const props = defineProps<{
  gameData: gameData
  playersInfo: PlayerInfoDto[]
}>()

const emit = defineEmits(['passTurn'])

const errorMessage = ref<string | undefined>(undefined)
const isLoading = ref<boolean>(false)

const users = ref<Record<string, User>>({})

props.playersInfo.forEach((player) => {
  if (isUndefined(player.userId)) {
    return
  }

  isLoading.value = true

  getUserById(player.userId)
    .then((fetchedUsers) => {
      if (isUndefined(player.userId)) {
        return
      }

      users.value[player.userId] = fetchedUsers
    })
    .catch(() => {
      errorMessage.value = "Erreur lors de la récupération d'un utilisateur"
    })
    .finally(() => {
      isLoading.value = false
    })
})

function passTurn() {
  if (!props.gameData.isPlayerTurn) {
    return
  }

  props.gameData.socket.emit(
    'passTurn',
    props.gameData.roomId,
    props.gameData.playerRole,
    (response: SocketResponse) => {
      handleSocketResponse(errorMessage, response)
    }
  )

  emit('passTurn')
}
</script>

<template>
  <div class="flex flex-col justify-center items-center size-full">
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
        <p class="mb-10">Cliquez sur l'un de vos pions</p>
        <button @click="passTurn" class="button mb-10">Passer son tour</button>
      </section>
    </section>
    <p v-else class="medium-title size-full mb-20">
      {{
        gameData.gameState.winner === gameData.playerRole
          ? 'Vous avez gagnez !'
          : 'Vous avez perdu ...'
      }}
    </p>
    <section class="flex justify-center space-x-5 md:space-x-10 mb-10">
      <div
        v-for="playerInfo in playersInfo"
        :key="playerInfo.socketId"
        class="flex flex-col items-center"
      >
        <PawnComponent
          sizeClass="size-5"
          :colorClass="playerInfo.role === PlayerRole.Player1 ? 'bg-player1' : 'bg-player2'"
          orientationClass="rotate-0"
        />
        <p class="small-title">
          {{ playerInfo.role === PlayerRole.Player1 ? 'Joueur 1' : 'Joueur 2' }}
          <span :class="playerInfo.isConnected ? 'text-success' : 'text-error'">●</span>
        </p>

        <Loading v-if="isLoading" class="absolute top-5 right-5 w-5 h-5" />
        <template v-else>
          <div
            v-if="isDefined(playerInfo.userId) && isDefined(users[playerInfo.userId])"
            class="flex bg-dark_light p-5 rounded-xl flex-col items-center mt-5"
          >
            <AvatarFinder :avatarId="users[playerInfo.userId].avatarId" class="w-16 h-16" />
            <p class="font-primary_bold mb-2">{{ users[playerInfo.userId].pseudo }}</p>
            <p class="text-center">
              <span>Score ELO :</span>
              {{ users[playerInfo.userId].eloScore }}
            </p>
          </div>
        </template>
      </div>
    </section>
  </div>
  <ErrorDisplayer v-if="isDefined(errorMessage)" v-model="errorMessage" />
</template>
