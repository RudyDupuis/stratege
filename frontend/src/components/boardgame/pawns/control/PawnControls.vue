<script setup lang="ts">
import useBoardGameOrientation from '@/composables/boardgame/useBoardGameOrientation'
import { computed, type Ref } from 'vue'
import { PlayerRole } from '@shared/gameState/entities/PlayerRoleEnum'
import { Orientation } from '@shared/pawn/entities/OrientationEnum'
import { handleSocketResponse, type SocketResponse } from '@/utils/socketHelpers'
import { Action } from '@shared/pawn/entities/ActionEnum'
import MovePawnSvg from '@/components/svgs/pawn/MovePawnSvg.vue'
import PushPawnSvg from '@/components/svgs/pawn/PushPawnSvg.vue'
import PullPawnSvg from '@/components/svgs/pawn/PullPawnSvg.vue'
import KillPawnSvg from '@/components/svgs/pawn/KillPawnSvg.vue'
import type Pawn from '@shared/pawn/entities/Pawn'
import { requiredInject } from '@/utils/requiredInject'
import type { Socket } from 'socket.io-client'
import PawnDisplay from '../display/PawnDisplay.vue'
import type { PositionsAvailableForActions } from '@shared/gameState/utils/determineAvailablePositionsForActions/determineAvailablePositionsForActions'

const socket = requiredInject<Socket>('socket')
const roomId = requiredInject<Ref<string>>('roomId')
const playerRole = requiredInject<Ref<PlayerRole>>('playerRole')

const props = defineProps<{
  targetPawn: Pawn
  positionsAvailableForActions: PositionsAvailableForActions
  rowIndex: number
  colIndex: number
}>()

const action = defineModel<Action | undefined>()
const emit = defineEmits(['rotatePawn', 'unselectPawn'])

const canMove = computed(() => {
  return props.positionsAvailableForActions.positionsAvailableForMoving.length > 0
})
const canKill = computed(() => {
  return props.positionsAvailableForActions.positionsAvailableForKilling.length > 0
})
const canPush = computed(() => {
  return props.positionsAvailableForActions.positionsAvailableForPushing.length > 0
})
const canPull = computed(() => {
  return props.positionsAvailableForActions.positionsAvailableForPulling.length > 0
})

const pawnColorClass = computed(() => {
  switch (playerRole.value) {
    case PlayerRole.Player1:
      return 'bg-player1'
    case PlayerRole.Player2:
      return 'bg-player2'
  }
})

function rotatePawn(orientation: Orientation) {
  let orientationAccordingToBoardGameDirection: Orientation
  if (playerRole.value === PlayerRole.Player2) {
    switch (orientation) {
      case Orientation.NW:
        orientationAccordingToBoardGameDirection = Orientation.SE
        break
      case Orientation.NE:
        orientationAccordingToBoardGameDirection = Orientation.SW
        break
      case Orientation.SE:
        orientationAccordingToBoardGameDirection = Orientation.NW
        break
      case Orientation.SW:
        orientationAccordingToBoardGameDirection = Orientation.NE
        break
    }
  } else {
    orientationAccordingToBoardGameDirection = orientation
  }

  socket.emit(
    'rotatePawn',
    roomId.value,
    playerRole.value,
    props.targetPawn,
    orientationAccordingToBoardGameDirection,
    (response: SocketResponse) => {
      handleSocketResponse(response)
    }
  )

  emit('rotatePawn')
}
</script>

<template>
  <section
    v-if="targetPawn.position.row === rowIndex && targetPawn.position.col === colIndex"
    class="absolute grid grid-cols-3 grid-rows-3 place-items-center size-36 md:size-60 sm:size-52 z-20"
    :class="useBoardGameOrientation(playerRole)"
  >
    <div
      class="bg-light size-10 sm:size-16 flex items-center justify-center rounded-full cursor-pointer hover:opacity-50"
      @click="rotatePawn(Orientation.NW)"
    >
      <PawnDisplay
        sizeClass="size-5 sm:size-8"
        :colorClass="pawnColorClass"
        orientationClass="rotate-0"
      />
    </div>
    <div
      class="bg-light size-10 sm:size-16 flex items-center justify-center rounded-full cursor-pointer hover:opacity-50"
      :class="{
        'opacity-30': !canMove
      }"
      @click="action = Action.Move"
    >
      <MovePawnSvg
        :pawnfillClass="playerRole === PlayerRole.Player1 ? 'fill-player1' : 'fill-player2'"
        class="size-8 sm:size-10"
      />
    </div>
    <div
      class="bg-light size-10 sm:size-16 flex items-center justify-center rounded-full cursor-pointer hover:opacity-50"
      @click="rotatePawn(Orientation.NE)"
    >
      <PawnDisplay
        sizeClass="size-5 sm:size-8"
        :colorClass="pawnColorClass"
        orientationClass="rotate-90"
      />
    </div>
    <div
      class="bg-light size-10 sm:size-16 flex items-center justify-center rounded-full cursor-pointer hover:opacity-50"
      :class="{
        'opacity-30': !canPush
      }"
      @click="action = Action.Push"
    >
      <PushPawnSvg
        :pawnfillClass="playerRole === PlayerRole.Player1 ? 'fill-player1' : 'fill-player2'"
        class="size-8 sm:size-10"
      />
    </div>
    <div class="size-full cursor-pointer" @click="emit('unselectPawn')"></div>
    <div
      class="bg-light size-10 sm:size-16 flex items-center justify-center rounded-full cursor-pointer hover:opacity-50"
      :class="{
        'opacity-30': !canPull
      }"
      @click="action = Action.Pull"
    >
      <PullPawnSvg
        :pawnfillClass="playerRole === PlayerRole.Player1 ? 'fill-player1' : 'fill-player2'"
        class="size-8 sm:size-10"
      />
    </div>
    <div
      class="bg-light size-10 sm:size-16 flex items-center justify-center rounded-full cursor-pointer hover:opacity-50"
      @click="rotatePawn(Orientation.SW)"
    >
      <PawnDisplay
        sizeClass="size-5 sm:size-8"
        :colorClass="pawnColorClass"
        orientationClass="rotate-270"
      />
    </div>
    <div
      class="bg-light size-10 sm:size-16 flex items-center justify-center rounded-full cursor-pointer hover:opacity-50"
      :class="{
        'opacity-30': !canKill
      }"
      @click="action = Action.Kill"
    >
      <KillPawnSvg
        :pawnfillClass="playerRole === PlayerRole.Player1 ? 'fill-player1' : 'fill-player2'"
        class="size-8 sm:size-10"
      />
    </div>
    <div
      class="bg-light size-10 sm:size-16 flex items-center justify-center rounded-full cursor-pointer hover:opacity-50"
      @click="rotatePawn(Orientation.SE)"
    >
      <PawnDisplay
        sizeClass="size-5 sm:size-8"
        :colorClass="pawnColorClass"
        orientationClass="rotate-180"
      />
    </div>
  </section>
</template>
