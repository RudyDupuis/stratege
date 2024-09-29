<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Socket } from 'socket.io-client'
import { GameState } from '@shared/entities/GameState'
import { isDefined } from '@shared/helpers/TypeGuard'

const props = defineProps({
  socket: { type: Socket, required: true }
})

const gameState = ref<GameState | undefined>(undefined)

onMounted(() => {
  props.socket.on('gameState', (state: GameState) => {
    gameState.value = state
  })
})
</script>

<template>
  <div v-if="isDefined(gameState)" class="flex justify-center items-center">
    <div
      class="grid grid-cols-8 grid-rows-8"
      :style="{ width: 'min(90vw, 90vh)', height: 'min(90vw, 90vh)' }"
    >
      <div v-for="(row, rowIndex) in gameState.board" :key="rowIndex" class="contents">
        <div
          v-for="(_cell, colIndex) in row"
          :key="colIndex"
          class="flex items-center justify-center border border-gray-500"
        >
          <span v-if="gameState.board[rowIndex][colIndex] !== null">
            {{ gameState.board[rowIndex][colIndex].orientation }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
