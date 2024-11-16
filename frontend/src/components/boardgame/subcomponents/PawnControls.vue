<script setup lang="ts">
import useBoardGameOrientation from '@/composables/boardgame/useBoardGameOrientation'
import type { gameData } from '../BoardGameHandler.vue'
import { computed, ref } from 'vue'
import { PlayerRole } from '@shared/gameState/entities/PlayerRoleEnum'
import PawnComponent from './PawnComponent.vue'
import { isDefined, isUndefined } from '@shared/utils/TypeGuard'
import { Orientation } from '@shared/pawn/entities/OrientationEnum'
import { handleSocketResponse, type SocketResponse } from '@/utils/socketHelpers'
import ErrorDisplayer from '@/components/shared/ErrorDisplayer.vue'
import { Action } from '@shared/pawn/entities/ActionEnum'
import MovePawnSvg from '@/components/svgs/pawn/MovePawnSvg.vue'
import PushPawnSvg from '@/components/svgs/pawn/PushPawnSvg.vue'
import PullPawnSvg from '@/components/svgs/pawn/PullPawnSvg.vue'
import KillPawnSvg from '@/components/svgs/pawn/KillPawnSvg.vue'

const props = defineProps<{
  gameData: gameData
  canMove: boolean
  canKill: boolean
  canPush: boolean
  canPull: boolean
}>()

const action = defineModel<Action | undefined>()
const emit = defineEmits(['rotatePawn', 'unselectPawn'])

const errorMessage = ref<string | undefined>(undefined)

const pawnColorClass = computed(() => {
  switch (props.gameData.playerRole) {
    case PlayerRole.Player1:
      return 'bg-player1'
    case PlayerRole.Player2:
      return 'bg-player2'
  }
})

function rotatePawn(orientation: Orientation) {
  if (isUndefined(props.gameData.targetPawn) || !props.gameData.isPlayerTurn) {
    return
  }

  let orientationAccordingToBoardGameDirection: Orientation
  if (props.gameData.playerRole === PlayerRole.Player2) {
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

  props.gameData.socket.emit(
    'rotatePawn',
    props.gameData.roomId,
    props.gameData.playerRole,
    props.gameData.targetPawn,
    orientationAccordingToBoardGameDirection,
    (response: SocketResponse) => {
      handleSocketResponse(errorMessage, response)
    }
  )

  emit('rotatePawn')
}
</script>

<template>
  <section
    class="absolute grid grid-cols-3 grid-rows-3 place-items-center size-36 md:size-60 sm:size-52 z-50"
    :class="useBoardGameOrientation(gameData.playerRole)"
  >
    <div
      class="bg-light size-10 sm:size-16 flex items-center justify-center rounded-full cursor-pointer hover:opacity-50"
      @click="rotatePawn(Orientation.NW)"
    >
      <PawnComponent
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
        :pawnfillClass="
          gameData.playerRole === PlayerRole.Player1 ? 'fill-player1' : 'fill-player2'
        "
        class="size-8 sm:size-10"
      />
    </div>
    <div
      class="bg-light size-10 sm:size-16 flex items-center justify-center rounded-full cursor-pointer hover:opacity-50"
      @click="rotatePawn(Orientation.NE)"
    >
      <PawnComponent
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
        :pawnfillClass="
          gameData.playerRole === PlayerRole.Player1 ? 'fill-player1' : 'fill-player2'
        "
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
        :pawnfillClass="
          gameData.playerRole === PlayerRole.Player1 ? 'fill-player1' : 'fill-player2'
        "
        class="size-8 sm:size-10"
      />
    </div>
    <div
      class="bg-light size-10 sm:size-16 flex items-center justify-center rounded-full cursor-pointer hover:opacity-50"
      @click="rotatePawn(Orientation.SW)"
    >
      <PawnComponent
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
        :pawnfillClass="
          gameData.playerRole === PlayerRole.Player1 ? 'fill-player1' : 'fill-player2'
        "
        class="size-8 sm:size-10"
      />
    </div>
    <div
      class="bg-light size-10 sm:size-16 flex items-center justify-center rounded-full cursor-pointer hover:opacity-50"
      @click="rotatePawn(Orientation.SE)"
    >
      <PawnComponent
        sizeClass="size-5 sm:size-8"
        :colorClass="pawnColorClass"
        orientationClass="rotate-180"
      />
    </div>
  </section>
  <ErrorDisplayer
    v-if="isDefined(errorMessage)"
    v-model="errorMessage"
    :class="useBoardGameOrientation(gameData.playerRole)"
  />
</template>
