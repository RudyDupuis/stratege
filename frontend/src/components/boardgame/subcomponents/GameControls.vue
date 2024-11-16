<script setup lang="ts">
import { handleSocketResponse, type SocketResponse } from '@/utils/socketHelpers'
import { isDefined, isUndefined } from '@shared/utils/TypeGuard'
import { ref } from 'vue'
import ErrorDisplayer from '@/components/shared/ErrorDisplayer.vue'
import type { gameData } from '../BoardGameHandler.vue'
import { PlayerRole } from '@shared/gameState/entities/PlayerRoleEnum'
import { getUserById } from '@/utils/api'
import type User from '@shared/user/entities/User'
import AvatarFinder from '@/components/user/AvatarFinder.vue'
import PawnComponent from './PawnComponent.vue'
import Loading from '@/components/shared/Loading.vue'
import type PlayerInfo from '@shared/user/entities/PlayerInfo'
import type EndGameInformation from '@shared/gameState/entities/EndGameInformation'
import type EndGameInformationDto from '@shared/gameState/entities/EndGameInformationDto'
import { endGameInformationDtoToEntity } from '@shared/gameState/mappers/endGameInformationMapper'

const props = defineProps<{
  gameData: gameData
  playersInfo: PlayerInfo[]
}>()

const emit = defineEmits(['passTurn'])

const errorMessage = ref<string | undefined>(undefined)
const isLoading = ref<boolean>(false)

const users = ref<Record<string, User>>({})
const endGameInformation = ref<EndGameInformation | undefined>(undefined)

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

props.gameData.socket.on('endGameInformation', (endGameInformationDto: EndGameInformationDto) => {
  endGameInformation.value = endGameInformationDtoToEntity(endGameInformationDto)
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
      v-if="isUndefined(endGameInformation)"
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
    </section>

    <section v-else class="flex flex-col justify-center items-center size-full">
      <p class="medium-title mb-10">
        {{
          endGameInformation.winner.playerRole === gameData.playerRole
            ? 'Vous avez gagné !'
            : 'Vous avez perdu ...'
        }}
      </p>

      <section
        v-if="isDefined(endGameInformation.winner.user) && isDefined(endGameInformation.loser.user)"
        class="flex justify-center space-x-5 md:space-x-10 mb-10"
      >
        <div class="flex flex-col items-center">
          <p class="texte-center text-3xl font-primary_bold text-success mb-5">
            +
            {{
              endGameInformation.winner.user.eloScore -
              users[endGameInformation.winner.user.id].eloScore
            }}
          </p>
          <div class="flex flex-col items-center bg-dark_light p-5 rounded-xl">
            <p class="small-title mb-5">Gagnant !</p>
            <AvatarFinder :avatarId="endGameInformation.winner.user.avatarId" class="w-16 h-16" />
            <p class="font-primary_bold mb-2">{{ endGameInformation.winner.user.pseudo }}</p>
            <p class="text-center">
              <span>Score ELO :</span>
              {{ endGameInformation.winner.user.eloScore }}
            </p>
          </div>
        </div>
        <div class="flex flex-col items-center">
          <p class="texte-center text-3xl font-primary_bold text-error mb-5">
            -
            {{
              users[endGameInformation.loser.user.id].eloScore -
              endGameInformation.loser.user.eloScore
            }}
          </p>
          <div class="flex flex-col items-center bg-dark_light p-5 rounded-xl">
            <p class="small-title mb-5">Perdant ...</p>
            <AvatarFinder :avatarId="endGameInformation.loser.user.avatarId" class="w-16 h-16" />
            <p class="font-primary_bold mb-2">{{ endGameInformation.loser.user.pseudo }}</p>
            <p class="text-center">
              <span>Score ELO :</span>
              {{ endGameInformation.loser.user.eloScore }}
            </p>
          </div>
        </div>
      </section>
    </section>
  </div>
  <ErrorDisplayer v-if="isDefined(errorMessage)" v-model="errorMessage" />
</template>
