<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Socket } from 'socket.io-client'
import GameState from '@shared/gameState/entities/GameState'
import { isDefined, isNotNull, isUndefined } from '@shared/utils/TypeGuard'
import PawnPosition from '@shared/pawnPosition/entities/PawnPosition'
import type Pawn from '@shared/pawn/entities/Pawn'
import { Player } from '@shared/gameState/entities/PlayerEnum'
import ErrorDisplayer from '../shared/ErrorDisplayer.vue'
import GameControls from './subcomponents/GameControls.vue'
import PawnAction from './subcomponents/PawnAction.vue'
import PawnHandler from './PawnHandler.vue'
import GameInformations from './subcomponents/GameInformations.vue'
import { Action } from '@shared/pawn/entities/ActionEnum'
import PawnControls from './subcomponents/PawnControls.vue'

const props = defineProps<{
  roomId: string
  socket: Socket
  player: Player
  gameState: GameState
}>()

const errorMessage = ref<string | undefined>(undefined)

const targetPawn = ref<Pawn | undefined>(undefined)
const openPawnControls = ref<boolean>(false)

const positionsAvailableForMoving = ref<PawnPosition[]>([])
const positionsAvailableForKilling = ref<PawnPosition[]>([])
const positionsAvailableForPushing = ref<PawnPosition[]>([])
const positionsAvailableForPulling = ref<PawnPosition[]>([])

const action = ref<Action | undefined>(undefined)

const isPlayerTurn = computed(() => {
  return props.gameState.determinePlayerBasedOnTurn() === props.player
})

function resetTarget() {
  targetPawn.value = undefined
  action.value = undefined
  positionsAvailableForMoving.value = []
  positionsAvailableForKilling.value = []
  positionsAvailableForPushing.value = []
  positionsAvailableForPulling.value = []
}

function selectPawn(pawn: Pawn) {
  if (pawn.owner !== props.player || !isPlayerTurn.value || isDefined(props.gameState.winner)) {
    return
  }

  targetPawn.value = pawn
  openPawnControls.value = true

  const {
    returnedPositionsAvailableForMoving,
    returnedPositionsAvailableForKilling,
    returnedPositionsAvailableForPushing,
    returnedPositionsAvailableForPulling
  } = props.gameState.determineAvailablePositionsForActions(pawn, props.player)
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

function handleMouseUp() {
  openPawnControls.value = false
}

onMounted(() => {
  window.addEventListener('mouseup', handleMouseUp)
  //Todo: I can't get the touchend event to work in PawnControls so i comment out this line to make it work with a click instead of a drag
  // window.addEventListener('touchend', handleMouseUp)
})

onBeforeUnmount(() => {
  window.removeEventListener('mouseup', handleMouseUp)
  // window.removeEventListener('touchend', handleMouseUp)
})
</script>

<template>
  <section class="flex flex-col xl:flex-row justify-center w-full items-center">
    <section class="flex flex-col justify-center items-center py-10 xl:py-0">
      <GameInformations
        :turn="gameState.turn"
        :player1s-lost-pawns-number="gameState.determinePlayersLostPawns().player1sLostPawns.length"
        :player2s-lost-pawns-number="gameState.determinePlayersLostPawns().player2sLostPawns.length"
      />
      <div class="p-6 rounded-xl bg-dark_light">
        <div
          class="grid grid-cols-8 grid-rows-8 border border-dark"
          :style="{ width: 'min(80vw, 80vh)', height: 'min(80vw, 80vh)' }"
          :class="{ 'rotate-180': player === Player.Player2 }"
        >
          <div v-for="(row, rowIndex) in gameState.board" :key="rowIndex" class="contents">
            <div
              v-for="(pawn, colIndex) in row"
              :key="colIndex"
              class="flex justify-center items-center border border-dark relative"
            >
              <PawnAction
                v-if="action === Action.Move"
                :game-data="gameData"
                :action="Action.Move"
                :positions-available-for-action="positionsAvailableForMoving"
                :row-index="rowIndex"
                :col-index="colIndex"
                :reset-target="resetTarget"
              />
              <PawnAction
                v-if="action === Action.Kill"
                :game-data="gameData"
                :action="Action.Kill"
                :positions-available-for-action="positionsAvailableForKilling"
                :row-index="rowIndex"
                :col-index="colIndex"
                :reset-target="resetTarget"
              />
              <PawnAction
                v-if="action === Action.Push"
                :game-data="gameData"
                :action="Action.Push"
                :positions-available-for-action="positionsAvailableForPushing"
                :row-index="rowIndex"
                :col-index="colIndex"
                :reset-target="resetTarget"
              />
              <PawnAction
                v-if="action === Action.Pull"
                :game-data="gameData"
                :action="Action.Pull"
                :positions-available-for-action="positionsAvailableForPulling"
                :row-index="rowIndex"
                :col-index="colIndex"
                :reset-target="resetTarget"
              />
              <PawnControls
                v-if="
                  targetPawn?.position.row === rowIndex &&
                  targetPawn?.position.col === colIndex &&
                  openPawnControls &&
                  isUndefined(gameState.winner)
                "
                :can-move="positionsAvailableForMoving.length > 0"
                :can-kill="positionsAvailableForKilling.length > 0"
                :can-push="positionsAvailableForPushing.length > 0"
                :can-pull="positionsAvailableForPulling.length > 0"
                v-model="action"
                :game-data="gameData"
                :reset-target="resetTarget"
              />
              <PawnHandler
                v-if="isNotNull(pawn)"
                :key="pawn.id"
                :pawn="pawn"
                :player="player"
                :class="{
                  'opacity-60': targetPawn === pawn,
                  'cursor-pointer': isPlayerTurn && pawn.owner === player,
                  'outline outline-3 outline-light':
                    isPlayerTurn && pawn.owner === player && pawn.remainingMove > 0
                }"
                @mousedown="selectPawn(pawn)"
                @touchstart.prevent="selectPawn(pawn)"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <GameControls :game-data="gameData" :reset-target="resetTarget" />
  </section>
  <ErrorDisplayer v-if="isDefined(errorMessage)" v-model="errorMessage" />
</template>
