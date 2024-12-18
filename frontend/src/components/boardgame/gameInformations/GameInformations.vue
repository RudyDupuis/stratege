<script setup lang="ts">
import { isDefined, isUndefined } from '@shared/utils/TypeGuard'
import { PlayerRole } from '@shared/gameState/entities/PlayerRoleEnum'
import type User from '@shared/user/entities/User'
import AvatarFinder from '@/components/user/AvatarFinder.vue'
import Loading from '@/components/shared/Loading.vue'
import type PlayerInfo from '@shared/user/entities/PlayerInfo'
import PawnDisplay from '../pawns/display/PawnDisplay.vue'
import { requiredInject } from '@/utils/requiredInject'
import { ref, type Ref } from 'vue'
import Dialog from '@/components/shared/Dialog.vue'
import type { Socket } from 'socket.io-client'
import { AiLevel } from '@shared/room/entities/AiLevelEnum'

const isPlayerTurn = requiredInject<Ref<boolean>>('isPlayerTurn')
const playersInfo = requiredInject<Ref<PlayerInfo[]>>('playersInfo')
const socket = requiredInject<Socket>('socket')
const aiLevel = requiredInject<Ref<AiLevel | undefined>>('aiLevel')

defineProps<{
  usersLinkedToConnectedPlayers: Record<string, User>
  usersLinkedToConnectedPlayersIsLoading: boolean
}>()

const emit = defineEmits(['passTurn', 'giveUp'])

const showGiveUpDialog = ref<boolean>(false)
const giveUpRemainingTime = ref<number | undefined>(undefined)

socket.on('gameGiveUpRemainingTime', (fetchedGiveUpRemainingTime: number) => {
  giveUpRemainingTime.value = fetchedGiveUpRemainingTime
})
</script>

<template>
  <section class="flex flex-col justify-center items-center size-full">
    <p class="medium-title mb-10">
      {{ isPlayerTurn ? 'A vous de jouer !' : 'Au tour de votre adversaire ...' }}
    </p>

    <section v-show="isPlayerTurn" class="flex flex-col justify-center items-center size-full">
      <p class="mb-10">Cliquez sur l'un de vos pions</p>
      <button v-button-click-sound @click="emit('passTurn')" class="button mb-4">
        Passer son tour
      </button>
    </section>

    <button v-button-click-sound class="danger-button mb-10" @click="showGiveUpDialog = true">
      <i class="fa-regular fa-flag mr-2" />
      Abandonner
    </button>

    <Dialog v-show="showGiveUpDialog">
      <p class="small-title mb-5">Êtes-vous sur de vouloir abandonner ?</p>
      <div
        class="flex flex-col space-y-5 md:space-y-0 md:space-x-5 md:flex-row items-center justify-center"
      >
        <button
          v-button-click-sound
          class="danger-button small-button"
          @click="
            () => {
              showGiveUpDialog = false
              emit('giveUp')
            }
          "
        >
          Oui
        </button>
        <button v-button-click-sound class="button small-button" @click="showGiveUpDialog = false">
          Non
        </button>
      </div>
    </Dialog>

    <p v-if="playersInfo.some((playerInfo) => !playerInfo.isConnected)" class="mb-10">
      <i class="fa-solid fa-triangle-exclamation mr-2 text-error" />
      Votre adversaire est déconnecté. Si il ne se reconnecte pas dans
      {{ giveUpRemainingTime }} s, la partie sera finit.
    </p>

    <section class="flex justify-center space-x-5 md:space-x-10 mb-10">
      <div
        v-for="playerInfo in playersInfo"
        :key="playerInfo.socketId"
        class="flex flex-col items-center"
      >
        <PawnDisplay
          sizeClass="size-5"
          :colorClass="playerInfo.role === PlayerRole.Player1 ? 'bg-player1' : 'bg-player2'"
          orientationClass="rotate-0"
          class="mb-2"
        />
        <p>
          <span
            v-if="isDefined(aiLevel) && playerInfo.role === PlayerRole.Player2"
            class="small-title mr-1"
          >
            IA
            <i v-if="aiLevel === AiLevel.Easy" class="fa-solid fa-seedling" />
            <i v-if="aiLevel === AiLevel.Medium" class="fa-solid fa-dumbbell" />
            <i v-if="aiLevel === AiLevel.Hard" class="fa-solid fa-skull" />
          </span>
          <span v-else class="small-title mr-1">
            {{ playerInfo.role === PlayerRole.Player1 ? 'Joueur 1' : 'Joueur 2' }}
          </span>
          <span :class="playerInfo.isConnected ? 'text-success' : 'text-error'">●</span>
        </p>

        <Loading
          v-if="usersLinkedToConnectedPlayersIsLoading"
          class="absolute top-5 right-5 w-5 h-5"
        />
        <template v-else>
          <div
            v-if="
              isDefined(playerInfo.userId) &&
              isDefined(usersLinkedToConnectedPlayers[playerInfo.userId])
            "
            class="flex bg-dark_light p-5 rounded-xl flex-col items-center mt-5"
          >
            <AvatarFinder
              :avatarId="usersLinkedToConnectedPlayers[playerInfo.userId].avatarId"
              class="w-16 h-16"
            />
            <p class="font-primary_bold text-center mb-2">
              {{ usersLinkedToConnectedPlayers[playerInfo.userId].pseudo }}
            </p>
            <p class="text-center">
              <span>Score ELO :</span>
              {{ usersLinkedToConnectedPlayers[playerInfo.userId].eloScore }}
            </p>
          </div>
        </template>
      </div>
    </section>
  </section>
</template>
