<script setup lang="ts">
import { ref, computed } from 'vue'
import { Socket } from 'socket.io-client'
import { GameState } from '@shared/entities/GameState'
import { isDefined, isNotNull } from '@shared/helpers/TypeGuard'
import { PawnPosition } from '@shared/entities/PawnPosition'
import type { Pawn } from '@shared/entities/Pawn'
import { Player } from '@shared/Enum'
import ErrorDisplayer from '../shared/ErrorDisplayer.vue'
import GameControls from './subcomponents/GameControls.vue'
import GameAction from './subcomponents/GameAction.vue'
import PawnHandler from './PawnHandler.vue'
import GameInformations from './subcomponents/GameInformations.vue'

const props = defineProps<{
  roomId: string
  socket: Socket
  player: Player
  gameState: GameState
}>()

const errorMessage = ref<string | undefined>(undefined)

const targetPawn = ref<Pawn | undefined>(undefined)
const positionsAvailableForMoving = ref<PawnPosition[]>([])
const positionsAvailableForKilling = ref<PawnPosition[]>([])
const positionsAvailableForPushing = ref<PawnPosition[]>([])
const positionsAvailableForPulling = ref<PawnPosition[]>([])

const actions = ref<'move_kill' | 'push_pull'>('move_kill')

const isPlayerTurn = computed(() => {
  return props.gameState.determinePlayerBasedOnTurn() === props.player
})

function resetTarget() {
  targetPawn.value = undefined
  actions.value = 'move_kill'
  positionsAvailableForMoving.value = []
  positionsAvailableForKilling.value = []
  positionsAvailableForPushing.value = []
  positionsAvailableForPulling.value = []
}

function selectPawn(pawn: Pawn) {
  if (pawn.owner !== props.player || !isPlayerTurn.value || isDefined(props.gameState.winner)) {
    return
  }

  if (targetPawn.value === pawn) {
    resetTarget()
    return
  }

  targetPawn.value = pawn
  const {
    returnedPositionsAvailableForMoving,
    returnedPositionsAvailableForKilling,
    returnedPositionsAvailableForPushing,
    returnedPositionsAvailableForPulling
  } = props.gameState.calculatePositionsAvailableForMovingKillingPushingOrPulling(
    pawn,
    props.player
  )
  positionsAvailableForMoving.value = returnedPositionsAvailableForMoving
  positionsAvailableForKilling.value = returnedPositionsAvailableForKilling
  positionsAvailableForPushing.value = returnedPositionsAvailableForPushing
  positionsAvailableForPulling.value = returnedPositionsAvailableForPulling
}
export interface gameData {
  roomId: string
  player: Player
  gameState: GameState
  socket: Socket
  targetPawn: Pawn | undefined
  isPlayerTurn: boolean
}

const gameData = computed<gameData>(() => {
  return {
    roomId: props.roomId,
    player: props.player,
    gameState: props.gameState,
    socket: props.socket,
    targetPawn: targetPawn.value,
    isPlayerTurn: isPlayerTurn.value
  }
})
</script>

<template>
  <section class="flex flex-col xl:flex-row justify-center w-full items-center">
    <section class="flex flex-col justify-center items-center py-10 xl:py-0">
      <GameInformations
        :turn="gameState.turn"
        :player1s-lost-pawns-number="gameState.player1sLostPawns.length"
        :player2s-lost-pawns-number="gameState.player2sLostPawns.length"
      />
      <div class="p-6 rounded-xl bg-dark_light">
        <div
          class="grid grid-cols-8 grid-rows-8 border border-dark"
          :style="{ width: 'min(80vw, 80vh)', height: 'min(80vw, 80vh)' }"
          :class="{ 'rotate-180': player === Player.Player2 }"
        >
          <div v-for="(row, rowIndex) in gameState.board" :key="rowIndex" class="contents">
            <div
              v-for="(_, colIndex) in row"
              :key="colIndex"
              class="flex justify-center items-center border border-dark relative"
            >
              <template v-if="actions === 'move_kill'">
                <GameAction
                  :game-data="gameData"
                  action="move"
                  :positions-available-for-action="positionsAvailableForMoving"
                  :row-index="rowIndex"
                  :col-index="colIndex"
                  :reset-target="resetTarget"
                />
                <GameAction
                  :game-data="gameData"
                  action="kill"
                  :positions-available-for-action="positionsAvailableForKilling"
                  :row-index="rowIndex"
                  :col-index="colIndex"
                  :reset-target="resetTarget"
                />
              </template>
              <template v-if="actions === 'push_pull'">
                <GameAction
                  :game-data="gameData"
                  action="push"
                  :positions-available-for-action="positionsAvailableForPushing"
                  :row-index="rowIndex"
                  :col-index="colIndex"
                  :reset-target="resetTarget"
                />
                <GameAction
                  :game-data="gameData"
                  action="pull"
                  :positions-available-for-action="positionsAvailableForPulling"
                  :row-index="rowIndex"
                  :col-index="colIndex"
                  :reset-target="resetTarget"
                />
              </template>
              <PawnHandler
                v-if="isNotNull(gameState.board[rowIndex][colIndex])"
                :pawn="gameState.board[rowIndex][colIndex]"
                :player="player"
                :class="{
                  'opacity-60': targetPawn === gameState.board[rowIndex][colIndex],
                  'cursor-pointer':
                    isPlayerTurn && gameState.board[rowIndex][colIndex]?.owner === player
                }"
                @click="selectPawn(gameState.board[rowIndex][colIndex])"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <GameControls v-model="actions" :game-data="gameData" :reset-target="resetTarget" />
  </section>
  <ErrorDisplayer v-if="isDefined(errorMessage)" v-model="errorMessage" />
</template>
