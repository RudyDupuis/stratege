<script setup lang="ts">
import { handleSocketResponse, type SocketResponse } from '@/utils/socketHelpers'
import { isUndefined } from '@shared/utils/TypeGuard'
import { ref, type Ref } from 'vue'
import { PlayerRole } from '@shared/gameState/entities/PlayerRoleEnum'
import { getUserById } from '@/utils/api'
import type User from '@shared/user/entities/User'
import type PlayerInfo from '@shared/user/entities/PlayerInfo'
import type EndGameInformation from '@shared/gameState/entities/EndGameInformation'
import GameInformations from './GameInformations.vue'
import EndGameInformations from './EndGameInformations.vue'
import { requiredInject } from '@/utils/requiredInject'
import type { Socket } from 'socket.io-client'
import { ErrorToDisplay, useErrorsStore } from '@/composables/error/useErrorsStore'

const socket = requiredInject<Socket>('socket')
const roomId = requiredInject<Ref<string>>('roomId')
const playerRole = requiredInject<Ref<PlayerRole>>('playerRole')
const isPlayerTurn = requiredInject<Ref<boolean>>('isPlayerTurn')
const playersInfo = requiredInject<Ref<PlayerInfo[]>>('playersInfo')
const endGameInformation = requiredInject<Ref<EndGameInformation | undefined>>('endGameInformation')

const emit = defineEmits(['passTurn'])

const usersLinkedToConnectedPlayers = ref<Record<string, User>>({})
const usersLinkedToConnectedPlayersIsLoading = ref<boolean>(false)

playersInfo.value.forEach((player) => {
  if (isUndefined(player.userId)) {
    return
  }

  usersLinkedToConnectedPlayersIsLoading.value = true

  getUserById(player.userId)
    .then((fetchedUsers) => {
      if (isUndefined(player.userId)) {
        return
      }

      usersLinkedToConnectedPlayers.value[player.userId] = fetchedUsers
    })
    .catch(() => {
      useErrorsStore().addError(
        new ErrorToDisplay("Erreur lors de la récupération d'un utilisateur")
      )
    })
    .finally(() => {
      usersLinkedToConnectedPlayersIsLoading.value = false
    })
})

function passTurn() {
  if (!isPlayerTurn.value) {
    return
  }

  socket.emit('passTurn', roomId.value, playerRole.value, (response: SocketResponse) => {
    handleSocketResponse(response)
  })

  emit('passTurn')
}
</script>

<template>
  <div class="flex flex-col justify-center items-center size-full">
    <GameInformations
      v-if="!endGameInformation"
      :usersLinkedToConnectedPlayers="usersLinkedToConnectedPlayers"
      :usersLinkedToConnectedPlayersIsLoading="usersLinkedToConnectedPlayersIsLoading"
      @passTurn="passTurn()"
      @giveUp="socket.emit('giveUp', roomId, playerRole)"
    />
    <EndGameInformations v-else :usersLinkedToConnectedPlayers="usersLinkedToConnectedPlayers" />
  </div>
</template>
