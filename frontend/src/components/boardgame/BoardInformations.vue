<script setup lang="ts">
import GameState from '@shared/gameState/entities/GameState'
import PawnDisplay from './pawns/display/PawnDisplay.vue'
import type { Ref } from 'vue'
import { requiredInject } from '@/utils/requiredInject'

const gameState = requiredInject<Ref<GameState>>('gameState')
</script>

<template>
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
</template>
