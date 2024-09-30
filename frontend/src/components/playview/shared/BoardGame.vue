<script setup lang="ts">
import { ref, onMounted, type PropType, watchEffect } from 'vue'
import { Socket } from 'socket.io-client'
import { GameState } from '@shared/entities/GameState'
import { isDefined, isUndefined } from '@shared/helpers/TypeGuard'
import PawnComponent from './PawnComponent.vue'
import { PawnPosition } from '@shared/entities/PawnPosition'
import type { Pawn } from '@shared/entities/Pawn'

const props = defineProps({
  socket: { type: Socket, required: true },
  player: { type: String as PropType<'player1' | 'player2'>, required: true },
  roomId: { type: String, required: true }
})

const gameState = ref<GameState | undefined>(undefined)
const availablePawnMove = ref<PawnPosition[]>([])
const targetPawn = ref<Pawn | undefined>(undefined)
const errorMessage = ref<string | undefined>(undefined)

function calculateAvailablePawnMove(pawn: Pawn) {
  if (isUndefined(gameState.value) || pawn.owner !== props.player) {
    return
  }

  targetPawn.value = pawn
  availablePawnMove.value = gameState.value.calculateAvailableMoves(pawn)
}

function movePawn(pawnPosition: PawnPosition) {
  if (
    isUndefined(gameState.value) ||
    isUndefined(targetPawn.value) ||
    isUndefined(availablePawnMove.value)
  ) {
    return
  }

  props.socket.emit(
    'movePawn',
    props.roomId,
    props.player,
    targetPawn.value,
    pawnPosition,
    (response: any) => {
      if (response?.error) {
        errorMessage.value = response.error
      }
    }
  )

  targetPawn.value = undefined
  availablePawnMove.value = []
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
        >
          <div
            v-if="
              availablePawnMove.some(
                (pawnPosition) => pawnPosition.row === rowIndex && pawnPosition.col === colIndex
              )
            "
            class="bg-warning size-full"
            @click="movePawn(new PawnPosition(rowIndex, colIndex))"
          ></div>
          <PawnComponent
            v-if="gameState.board[rowIndex][colIndex] !== null"
            :pawn="gameState.board[rowIndex][colIndex]"
            :class="{
              'border-4 border-warning': targetPawn === gameState.board[rowIndex][colIndex]
            }"
            @click="calculateAvailablePawnMove(gameState.board[rowIndex][colIndex])"
          />
        </div>
      </div>
    </div>
    <div v-if="isDefined(errorMessage)">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>
