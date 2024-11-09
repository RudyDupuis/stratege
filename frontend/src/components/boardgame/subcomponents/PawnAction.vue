<script setup lang="ts">
import PawnPosition from '@shared/pawnPosition/entities/PawnPosition'
import { isDefined, isUndefined } from '@shared/utils/TypeGuard'
import { computed, ref } from 'vue'
import type { gameData } from '../BoardGameHandler.vue'
import { handleSocketResponse, type SocketResponse } from '@/utils/socketHelpers'
import ErrorDisplayer from '@/components/shared/ErrorDisplayer.vue'
import { Action } from '@shared/pawn/entities/ActionEnum'
import useBoardGameOrientation from '@/composables/boardgame/useBoardGameOrientation'

const props = defineProps<{
  gameData: gameData
  action: Action
  positionsAvailableForAction: PawnPosition[]
  rowIndex: number
  colIndex: number
}>()

const emit = defineEmits(['doAction'])

const errorMessage = ref<string | undefined>(undefined)
function pawnAction(desiredPawnPosition: PawnPosition) {
  if (isUndefined(props.gameData.targetPawn) || !props.gameData.isPlayerTurn) {
    return
  }
  props.gameData.socket.emit(
    `${props.action}Pawn`,
    props.gameData.roomId,
    props.gameData.player,
    props.gameData.targetPawn,
    desiredPawnPosition,
    (response: SocketResponse) => {
      handleSocketResponse(errorMessage, response)
    }
  )

  emit('doAction')
}

const cellColor = computed(() => {
  switch (props.action) {
    case Action.Move:
      return 'bg-moving'
    case Action.Kill:
      return 'bg-killing'
    case Action.Push:
      return 'bg-pushing'
    case Action.Pull:
      return 'bg-pulling'
  }
})
</script>

<template>
  <div
    v-if="
      positionsAvailableForAction.some(
        (pawnPosition) => pawnPosition.row === rowIndex && pawnPosition.col === colIndex
      ) && gameData.isPlayerTurn
    "
    :class="`${cellColor} size-full ${action === 'kill' ? 'absolute inset-0 z-10 opacity-40' : ''} cursor-pointer`"
    @click="pawnAction(new PawnPosition(rowIndex, colIndex))"
  ></div>
  <ErrorDisplayer
    v-if="isDefined(errorMessage)"
    v-model="errorMessage"
    :class="useBoardGameOrientation(gameData.player)"
  />
</template>
