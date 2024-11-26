<script setup lang="ts">
import GameState from '@shared/gameState/entities/GameState'
import PawnDisplay from './pawns/display/PawnDisplay.vue'
import { ref, type Ref } from 'vue'
import { requiredInject } from '@/utils/requiredInject'
import type { Socket } from 'socket.io-client'

const gameState = requiredInject<Ref<GameState>>('gameState')
const socket = requiredInject<Socket>('socket')

const turnTimeRemaining = ref<number>(GameState.TURN_TIME_SECONDS)

socket.on('gameTurnRemainingTime', (turnRemainingTime: number) => {
  turnTimeRemaining.value = turnRemainingTime
})
</script>

<template>
  <section class="flex flex-col items-center z-10">
    <div class="flex space-x-5">
      <p class="small-title">Tour n° {{ gameState.turn }}</p>
      <p class="small-title">-</p>
      <p class="flex items-center space-x-2 text-xl">
        <span class="small-title">
          {{
            GameState.MAX_PAWNS_PER_PLAYER -
            gameState.determinePlayersLostPawns().player1sLostPawns.length +
            '/' +
            GameState.MAX_PAWNS_PER_PLAYER
          }}
        </span>
        <PawnDisplay sizeClass="size-5" colorClass="bg-player1" orientationClass="rotate-0" />
        <span class="small-title">
          {{
            GameState.MAX_PAWNS_PER_PLAYER -
            gameState.determinePlayersLostPawns().player2sLostPawns.length +
            '/' +
            GameState.MAX_PAWNS_PER_PLAYER
          }}
        </span>
        <PawnDisplay sizeClass="size-5" colorClass="bg-player2" orientationClass="rotate-0" />
      </p>
    </div>
    <p
      class="small-title w-24 py-1 rounded-t-lg bg-dark_light remaning-time"
      :class="{ 'text-error': turnTimeRemaining <= 10 }"
    >
      <i
        class="fa-solid fa-hourglass-half mr-2"
        :class="{ 'text-error': turnTimeRemaining <= 10 }"
      />
      {{ turnTimeRemaining }} s
    </p>
  </section>
</template>

<style scoped>
.remaning-time {
  margin-bottom: -20px;
}
</style>
