<script setup lang="ts">
import { GameState } from '@shared/entities/GameState'
import PawnComponent from './PawnComponent.vue'

defineProps<{
  turn: number
  player1sLostPawnsNumber: number
  player2sLostPawnsNumber: number
}>()
</script>

<template>
  <div class="flex space-x-5">
    <p class="small-title">Tour n° {{ turn }}</p>
    <p class="small-title">-</p>
    <p class="flex items-center space-x-2 text-xl">
      <span class="small-title">{{
        GameState.MAX_PAWNS_PER_PLAYER -
        player1sLostPawnsNumber +
        '/' +
        GameState.MAX_PAWNS_PER_PLAYER
      }}</span>
      <PawnComponent sizeClass="size-5" colorClass="bg-player1" orientationClass="rotate-0" />
      <span class="small-title">{{
        GameState.MAX_PAWNS_PER_PLAYER -
        player2sLostPawnsNumber +
        '/' +
        GameState.MAX_PAWNS_PER_PLAYER
      }}</span>
      <PawnComponent sizeClass="size-5" colorClass="bg-player2" orientationClass="rotate-0" />
    </p>
  </div>
</template>
