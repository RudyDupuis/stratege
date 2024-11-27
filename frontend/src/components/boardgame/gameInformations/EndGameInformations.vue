<script setup lang="ts">
import { PlayerRole } from '@shared/gameState/entities/PlayerRoleEnum'
import type User from '@shared/user/entities/User'
import AvatarFinder from '@/components/user/AvatarFinder.vue'
import type EndGameInformation from '@shared/gameState/entities/EndGameInformation'
import { requiredInject } from '@/utils/requiredInject'
import { isDefined } from '@shared/utils/TypeGuard'
import type { Ref } from 'vue'

const playerRole = requiredInject<Ref<PlayerRole>>('playerRole')
const endGameInformation = requiredInject<Ref<EndGameInformation>>('endGameInformation')

defineProps<{
  usersLinkedToConnectedPlayers: Record<string, User>
}>()
</script>

<template>
  <section class="flex flex-col justify-center items-center size-full">
    <p class="medium-title mb-10">
      {{
        endGameInformation.winner.playerRole === playerRole
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
            usersLinkedToConnectedPlayers[endGameInformation.winner.user.id].eloScore
          }}
        </p>
        <div class="flex flex-col items-center bg-dark_light p-5 rounded-xl">
          <i class="fa-solid fa-crown" />
          <p class="small-title mb-5">Gagnant !</p>
          <AvatarFinder :avatarId="endGameInformation.winner.user.avatarId" class="w-16 h-16" />
          <p class="font-primary_bold text-center mb-2">
            {{ endGameInformation.winner.user.pseudo }}
          </p>
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
            usersLinkedToConnectedPlayers[endGameInformation.loser.user.id].eloScore -
            endGameInformation.loser.user.eloScore
          }}
        </p>
        <div class="flex flex-col items-center bg-dark_light p-5 rounded-xl">
          <i class="fa-solid fa-bolt" />
          <p class="small-title mb-5">Perdant ...</p>
          <AvatarFinder :avatarId="endGameInformation.loser.user.avatarId" class="w-16 h-16" />
          <p class="font-primary_bold text-center mb-2">
            {{ endGameInformation.loser.user.pseudo }}
          </p>
          <p class="text-center">
            <span>Score ELO :</span>
            {{ endGameInformation.loser.user.eloScore }}
          </p>
        </div>
      </div>
    </section>

    <RouterLink :to="{ name: 'home' }" class="button mb-5">
      <i class="fa-solid fa-home mr-2" />
      Retourner au menu
    </RouterLink>
  </section>
</template>
