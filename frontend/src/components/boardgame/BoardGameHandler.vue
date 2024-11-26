<script setup lang="ts">
import { ref, computed, provide, type Ref, watch } from 'vue'
import GameState from '@shared/gameState/entities/GameState'
import { isDefined, isNotNull, isUndefined } from '@shared/utils/TypeGuard'
import type Pawn from '@shared/pawn/entities/Pawn'
import { PlayerRole } from '@shared/gameState/entities/PlayerRoleEnum'
import BoardInformations from './BoardInformations.vue'
import { requiredInject } from '@/utils/requiredInject'
import PawnDisplayHandler from './pawns/display/PawnDisplayHandler.vue'
import GameInformationsHandler from './gameInformations/GameInformationsHandler.vue'
import type { Action } from '@shared/pawn/entities/ActionEnum'
import type { PositionsAvailableForActions } from '@shared/gameState/utils/determineAvailablePositionsForActions/determineAvailablePositionsForActions'
import PawnControls from './pawns/control/PawnControls.vue'
import PawnActions from './pawns/control/PawnActions.vue'
import type EndGameInformation from '@shared/gameState/entities/EndGameInformation'

const gameState = requiredInject<Ref<GameState>>('gameState')
const playerRole = requiredInject<Ref<PlayerRole>>('playerRole')
const endGameInformation = requiredInject<Ref<EndGameInformation | undefined>>('endGameInformation')

const targetPawn = ref<Pawn | undefined>(undefined)
const openPawnControls = ref<boolean>(false)
const action = ref<Action | undefined>(undefined)
watch(action, () => {
  if (isDefined(action.value)) {
    openPawnControls.value = false
  }
})

const positionsAvailableForActions = ref<PositionsAvailableForActions>({
  positionsAvailableForMoving: [],
  positionsAvailableForKilling: [],
  positionsAvailableForPushing: [],
  positionsAvailableForPulling: []
})

function selectPawn(pawn: Pawn) {
  if (
    pawn.owner !== playerRole.value ||
    !isPlayerTurn.value ||
    isDefined(endGameInformation.value)
  ) {
    return
  }
  resetTarget()
  targetPawn.value = pawn
  openPawnControls.value = true

  positionsAvailableForActions.value = gameState.value.determineAvailablePositionsForActions(
    targetPawn.value,
    playerRole.value
  )
}

function resetTarget() {
  targetPawn.value = undefined
  action.value = undefined
  positionsAvailableForActions.value = {
    positionsAvailableForMoving: [],
    positionsAvailableForKilling: [],
    positionsAvailableForPushing: [],
    positionsAvailableForPulling: []
  }
}
const isPlayerTurn = computed(() => {
  return (
    gameState.value.determinePlayerBasedOnTurn() === playerRole.value &&
    isUndefined(endGameInformation.value)
  )
})
provide('isPlayerTurn', isPlayerTurn)
</script>

<template>
  <section class="flex flex-col xl:flex-row justify-center w-full items-center mt-16 md:mt-0">
    <section class="flex flex-col justify-center items-center py-10 xl:py-0">
      <BoardInformations />
      <div class="p-6 rounded-xl bg-dark_light">
        <div
          class="grid grid-cols-8 grid-rows-8 border border-dark"
          :style="{ width: 'min(80vw, 80vh)', height: 'min(80vw, 80vh)' }"
          :class="{ 'rotate-180': playerRole === PlayerRole.Player2 }"
        >
          <div v-for="(row, rowIndex) in gameState.board" :key="rowIndex" class="contents">
            <div
              v-for="(pawn, colIndex) in row"
              :key="colIndex"
              class="flex justify-center items-center border border-dark relative"
            >
              <PawnActions
                v-if="isPlayerTurn && isDefined(targetPawn) && isDefined(action)"
                :target-pawn="targetPawn"
                :action="action"
                :positions-available-for-actions="positionsAvailableForActions"
                :row-index="rowIndex"
                :col-index="colIndex"
                @do-action="resetTarget()"
              />
              <PawnControls
                v-if="openPawnControls && isPlayerTurn && isDefined(targetPawn)"
                v-model="action"
                :target-pawn="targetPawn"
                :positions-available-for-actions="positionsAvailableForActions"
                :row-index="rowIndex"
                :col-index="colIndex"
                @rotate-pawn="resetTarget()"
                @unselect-pawn="resetTarget()"
              />
              <PawnDisplayHandler
                v-if="isNotNull(pawn)"
                :key="pawn.id"
                :pawn="pawn"
                :targetPawn="targetPawn"
                @mousedown="selectPawn(pawn)"
                @touchstart.prevent="selectPawn(pawn)"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <GameInformationsHandler @pass-turn="resetTarget()" />
  </section>
</template>
