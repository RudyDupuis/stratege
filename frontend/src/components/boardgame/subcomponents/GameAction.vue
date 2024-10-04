<script setup lang="ts">
import { PawnPosition } from '@shared/entities/PawnPosition'
import { isDefined, isUndefined } from '@shared/helpers/TypeGuard'
import { computed, ref } from 'vue'
import type { gameData } from '../BoardGameHandler.vue'
import { handleSocketResponse, type SocketResponse } from '@/helpers/socketHelpers'
import ErrorDisplayer from '@/components/shared/ErrorDisplayer.vue'

const props = defineProps<{
  gameData: gameData
  action: 'move' | 'kill' | 'push' | 'pull'
  positionsAvailableForAction: PawnPosition[]
  rowIndex: number
  colIndex: number
  resetTarget: () => void
}>()

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
  props.resetTarget()
}

const cellColor = computed(() => {
  switch (props.action) {
    case 'move':
      return 'bg-moving'
    case 'kill':
      return 'bg-killing'
    case 'push':
      return 'bg-pushing'
    case 'pull':
      return 'bg-pulling'
  }
})
//Todo Changer les couleurs
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
  <ErrorDisplayer v-if="isDefined(errorMessage)" v-model="errorMessage" />
</template>
