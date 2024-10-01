<script setup lang="ts">
import { ref, onMounted, type PropType, computed } from 'vue'
import { Socket } from 'socket.io-client'
import { GameState } from '@shared/entities/GameState'
import { isDefined, isUndefined } from '@shared/helpers/TypeGuard'
import PawnComponent from './PawnComponent.vue'
import { PawnPosition } from '@shared/entities/PawnPosition'
import type { Pawn } from '@shared/entities/Pawn'
import {
  killPawnSocketHanlder,
  movePawnSocketHandler,
  passTurnSocketHandler,
  rotatePawnSocketHandler
} from '@/sockets/gameSocketHandlers'

const props = defineProps({
  socket: { type: Socket, required: true },
  player: { type: String as PropType<'player1' | 'player2'>, required: true },
  roomId: { type: String, required: true }
})

const gameState = ref<GameState | undefined>(undefined)
const availablePawnMove = ref<PawnPosition[]>([])
const availableKillPawn = ref<PawnPosition[]>([])
const targetPawn = ref<Pawn | undefined>(undefined)
const errorMessage = ref<string | undefined>(undefined)

const isPlayerTurn = computed(() => {
  if (isUndefined(gameState.value)) {
    return false
  }
  return gameState.value.determinePlayerBasedOnTurn() === props.player
})

function resetTarget() {
  targetPawn.value = undefined
  availablePawnMove.value = []
  availableKillPawn.value = []
}

function selectPawn(pawn: Pawn) {
  if (isUndefined(gameState.value) || pawn.owner !== props.player || !isPlayerTurn.value) {
    return
  }

  targetPawn.value = pawn
  const { availableMoves, availableKills } = gameState.value.calculateAvailableMovesAndKills(
    pawn,
    props.player
  )
  availablePawnMove.value = availableMoves
  availableKillPawn.value = availableKills
}

function passTurn() {
  passTurnSocketHandler(props.socket, props.roomId, props.player, errorMessage, isPlayerTurn.value)
  resetTarget()
}

function movePawn(desiredPawnPosition: PawnPosition) {
  movePawnSocketHandler(
    props.socket,
    props.roomId,
    props.player,
    targetPawn.value,
    desiredPawnPosition,
    errorMessage,
    isPlayerTurn.value
  )
  resetTarget()
}

function killPawn(pawnPosition: PawnPosition) {
  killPawnSocketHanlder(
    props.socket,
    props.roomId,
    props.player,
    targetPawn.value,
    pawnPosition,
    errorMessage,
    isPlayerTurn.value
  )
  resetTarget()
}

function rotatePawn(orientation: 'NW' | 'SE' | 'NE' | 'SW') {
  rotatePawnSocketHandler(
    props.socket,
    props.roomId,
    props.player,
    targetPawn.value,
    orientation,
    errorMessage,
    isPlayerTurn.value
  )
  resetTarget()
}

onMounted(() => {
  props.socket.on('gameState', (state: GameState) => {
    gameState.value = new GameState(state.turn, state.board)
  })
})
</script>

<template>
  <div v-if="isDefined(gameState)" class="flex flex-col justify-center items-center">
    <p>
      Tour n° {{ gameState.turn }} -
      {{ isPlayerTurn ? 'A vous de jouer !' : 'Au tour de votre adversaire ...' }}
    </p>
    <div
      class="grid grid-cols-8 grid-rows-8 border border-dark"
      :style="{ width: 'min(90vw, 90vh)', height: 'min(90vw, 90vh)' }"
      :class="{ 'rotate-180': player === 'player2' }"
    >
      <div v-for="(row, rowIndex) in gameState.board" :key="rowIndex" class="contents">
        <div
          v-for="(_col, colIndex) in row"
          :key="colIndex"
          class="flex justify-center items-center border border-dark relative"
        >
          <div
            v-if="
              availablePawnMove.some(
                (pawnPosition) => pawnPosition.row === rowIndex && pawnPosition.col === colIndex
              ) && isPlayerTurn
            "
            class="bg-warning size-full"
            @click="movePawn(new PawnPosition(rowIndex, colIndex))"
          ></div>
          <div
            v-if="
              availableKillPawn.some(
                (pawnPosition) => pawnPosition.row === rowIndex && pawnPosition.col === colIndex
              ) && isPlayerTurn
            "
            class="bg-danger size-full absolute inset-0 z-10 opacity-40"
            @click="killPawn(new PawnPosition(rowIndex, colIndex))"
          ></div>
          <PawnComponent
            v-if="gameState.board[rowIndex][colIndex] !== null"
            :pawn="gameState.board[rowIndex][colIndex]"
            :class="{
              'border-4 border-warning': targetPawn === gameState.board[rowIndex][colIndex]
            }"
            @click="selectPawn(gameState.board[rowIndex][colIndex])"
          />
        </div>
      </div>
    </div>
    <div v-if="isPlayerTurn && isDefined(targetPawn)">
      <button @click="rotatePawn('NW')">Nord-Ouest</button>
      <button @click="rotatePawn('SE')">Sud-Est</button>
      <button @click="rotatePawn('NE')">Nord-Est</button>
      <button @click="rotatePawn('SW')">Sud-Ouest</button>
    </div>
    <button v-if="isPlayerTurn" @click="passTurn">Passer son tour</button>
    <div v-if="isDefined(errorMessage)">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>
