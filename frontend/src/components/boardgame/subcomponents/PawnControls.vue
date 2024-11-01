<script setup lang="ts">
import useBoardGameOrientation from '@/composables/boardgame/useBoardGameOrientation'
import type { gameData } from '../BoardGameHandler.vue'
import { computed, ref } from 'vue'
import { Player } from '@shared/gameState/entities/PlayerEnum'
import PawnComponent from './PawnComponent.vue'
import { isDefined, isUndefined } from '@shared/utils/TypeGuard'
import { Orientation } from '@shared/pawn/entities/OrientationEnum'
import { handleSocketResponse, type SocketResponse } from '@/utils/socketHelpers'
import ErrorDisplayer from '@/components/shared/ErrorDisplayer.vue'
import { Action } from '@shared/pawn/entities/ActionEnum'
import MovePawnSvg from '@/components/svgs/MovePawnSvg.vue'
import PushPawnSvg from '@/components/svgs/PushPawnSvg.vue'
import PullPawnSvg from '@/components/svgs/PullPawnSvg.vue'
import KillPawnSvg from '@/components/svgs/KillPawnSvg.vue'

const props = defineProps<{
  gameData: gameData
  canMove: boolean
  canKill: boolean
  canPush: boolean
  canPull: boolean
  resetTarget: () => void
}>()

const action = defineModel<Action | undefined>()

const errorMessage = ref<string | undefined>(undefined)

const pawnColorClass = computed(() => {
  switch (props.gameData.player) {
    case Player.Player1:
      return 'bg-player1'
    case Player.Player2:
      return 'bg-player2'
  }
})

function rotatePawn(orientation: Orientation) {
  if (isUndefined(props.gameData.targetPawn) || !props.gameData.isPlayerTurn) {
    return
  }

  let orientationAccordingToBoardGameDirection: Orientation
  if (props.gameData.player === Player.Player2) {
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
    props.gameData.player,
    props.gameData.targetPawn,
    orientationAccordingToBoardGameDirection,
    (response: SocketResponse) => {
      handleSocketResponse(errorMessage, response)
    }
  )
  props.resetTarget()
}
</script>

<template>
  <section
    class="absolute grid grid-cols-3 grid-rows-3 place-items-center size-36 md:size-60 sm:size-52 z-50"
    :class="useBoardGameOrientation(gameData.player)"
  >
    <div
      class="bg-light size-10 sm:size-16 flex items-center justify-center rounded-full cursor-pointer hover:opacity-50"
      @mouseup="rotatePawn(Orientation.NW)"
      @touchend="rotatePawn(Orientation.NW)"
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
      @mouseup="action = Action.Move"
      @touchend="action = Action.Move"
      @mouseenter="action = Action.Move"
      @mouseleave="action = undefined"
    >
      <MovePawnSvg
        :pawnfillClass="gameData.player === Player.Player1 ? 'fill-player1' : 'fill-player2'"
        class="size-8 sm:size-10"
      />
    </div>
    <div
      class="bg-light size-10 sm:size-16 flex items-center justify-center rounded-full cursor-pointer hover:opacity-50"
      @mouseup="rotatePawn(Orientation.NE)"
      @touchend="rotatePawn(Orientation.NE)"
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
      @mouseup="action = Action.Push"
      @touchend="action = Action.Push"
      @mouseenter="action = Action.Push"
      @mouseleave="action = undefined"
    >
      <PushPawnSvg
        :pawnfillClass="gameData.player === Player.Player1 ? 'fill-player1' : 'fill-player2'"
        class="size-8 sm:size-10"
      />
    </div>
    <div class="size-full" @mouseup="resetTarget()" @touchend="resetTarget()"></div>
    <div
      class="bg-light size-10 sm:size-16 flex items-center justify-center rounded-full cursor-pointer hover:opacity-50"
      :class="{
        'opacity-30': !canPull
      }"
      @mouseup="action = Action.Pull"
      @touchend="action = Action.Pull"
      @mouseenter="action = Action.Pull"
      @mouseleave="action = undefined"
    >
      <PullPawnSvg
        :pawnfillClass="gameData.player === Player.Player1 ? 'fill-player1' : 'fill-player2'"
        class="size-8 sm:size-10"
      />
    </div>
    <div
      class="bg-light size-10 sm:size-16 flex items-center justify-center rounded-full cursor-pointer hover:opacity-50"
      @mouseup="rotatePawn(Orientation.SW)"
      @touchend="rotatePawn(Orientation.SW)"
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
      @mouseup="action = Action.Kill"
      @touchend="action = Action.Kill"
      @mouseenter="action = Action.Kill"
      @mouseleave="action = undefined"
    >
      <KillPawnSvg
        :pawnfillClass="gameData.player === Player.Player1 ? 'fill-player1' : 'fill-player2'"
        class="size-8 sm:size-10"
      />
    </div>
    <div
      class="bg-light size-10 sm:size-16 flex items-center justify-center rounded-full cursor-pointer hover:opacity-50"
      @mouseup="rotatePawn(Orientation.SE)"
      @touchend="rotatePawn(Orientation.SE)"
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
    :class="useBoardGameOrientation(gameData.player)"
  />
</template>
