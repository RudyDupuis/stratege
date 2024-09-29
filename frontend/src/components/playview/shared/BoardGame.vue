<script setup lang="ts">
import { ref, onMounted, type PropType } from 'vue'
import { Socket } from 'socket.io-client'
import { GameState } from '@shared/entities/GameState'
import { isDefined } from '@shared/helpers/TypeGuard'
import PawnComponent from './PawnComponent.vue'
import { PawnPosition } from '@shared/entities/PawnPosition'
import type { Pawn } from '@shared/entities/Pawn'

const props = defineProps({
  socket: { type: Socket, required: true },
  player: { type: String as PropType<'player1' | 'player2'>, required: true }
})

const gameState = ref<GameState | undefined>(undefined)
const availablePawnMove = ref<PawnPosition[]>([])

function calculateAvailablePawnMove(pawn: Pawn) {
  if (isDefined(gameState.value)) {
    availablePawnMove.value = gameState.value.calculateAvailableMoves(pawn)
  }
}

onMounted(() => {
  props.socket.on('gameState', (state: GameState) => {
    gameState.value = new GameState(state.turn, state.board)
  })
})
</script>

<template>
  <div v-if="isDefined(gameState)" class="flex flex-col justify-center items-center">
    <p>Tour n° {{ gameState.turn }}</p>
    <div
      class="grid grid-cols-8 grid-rows-8 border border-dark"
      :style="{ width: 'min(90vw, 90vh)', height: 'min(90vw, 90vh)' }"
      :class="{ 'rotate-180': player === 'player2' }"
    >
      <div v-for="(row, rowIndex) in gameState.board" :key="rowIndex" class="contents">
        <div
          v-for="(_col, colIndex) in row"
          :key="colIndex"
          class="flex justify-center items-center border border-dark"
          :class="{
            'bg-warning': availablePawnMove.some(
              (pawnPosition) => pawnPosition.row === rowIndex && pawnPosition.col === colIndex
            )
          }"
        >
          <PawnComponent
            v-if="gameState.board[rowIndex][colIndex] !== null"
            :pawn="gameState.board[rowIndex][colIndex]"
            @click="calculateAvailablePawnMove(gameState.board[rowIndex][colIndex])"
          />
        </div>
      </div>
    </div>
  </div>
</template>
