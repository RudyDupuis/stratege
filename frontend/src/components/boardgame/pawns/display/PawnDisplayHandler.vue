<script setup lang="ts">
import Pawn from '@shared/pawn/entities/Pawn'
import { PlayerRole } from '@shared/gameState/entities/PlayerRoleEnum'
import { Orientation } from '@shared/pawn/entities/OrientationEnum'
import { computed, onMounted, ref, type Ref } from 'vue'
import { isDefined } from '@shared/utils/TypeGuard'
import { Action } from '@shared/pawn/entities/ActionEnum'
import PawnDisplay from './PawnDisplay.vue'
import { requiredInject } from '@/utils/requiredInject'
import { SoundManager } from '@/utils/soundManager'

const playerRole = requiredInject<Ref<PlayerRole>>('playerRole')
const isPlayerTurn = requiredInject<Ref<boolean>>('isPlayerTurn')

const props = defineProps<{
  pawn: Pawn
  targetPawn: Pawn | undefined
}>()

const pawnColor = computed(() => {
  switch (props.pawn.owner) {
    case PlayerRole.Player1:
      return 'bg-player1'
    case PlayerRole.Player2:
      return 'bg-player2'
  }
})

const pawnOrientation = computed(() => {
  switch (props.pawn.orientation) {
    case Orientation.NW:
      return 'rotate-0'
    case Orientation.SE:
      return 'rotate-180'
    case Orientation.NE:
      return 'rotate-90'
    case Orientation.SW:
      return 'rotate-270'
  }
})
const remainingMoveOrientation = computed(() => {
  //Orientation according to the direction of the board game (reversed for player 2)
  if (playerRole.value === PlayerRole.Player2) {
    switch (props.pawn.orientation) {
      case Orientation.NW:
        return 'rotate-180'
      case Orientation.SE:
        return 'rotate-0'
      case Orientation.NE:
        return 'rotate-90'
      case Orientation.SW:
        return 'rotate-270'
    }
  }

  switch (props.pawn.orientation) {
    case Orientation.NW:
      return 'rotate-0'
    case Orientation.SE:
      return 'rotate-180'
    case Orientation.NE:
      return 'rotate-270'
    case Orientation.SW:
      return 'rotate-90'
  }
})

const translateX = ref('0px')
const translateY = ref('0px')
const pawnRef = ref<InstanceType<typeof PawnDisplay> | undefined>(undefined)
const caseSize = ref(0)
const transition = ref(false)

onMounted(() => {
  if (isDefined(pawnRef.value)) {
    caseSize.value = pawnRef.value.size
  }

  if (isDefined(props.pawn.lastPosition)) {
    if (props.pawn.lastAction === Action.Kill) {
      if (playerRole.value === props.pawn.owner) {
        SoundManager.getInstance().playSound('kill_pawn')
      } else {
        SoundManager.getInstance().playSound('lose_pawn')
      }
    }

    translateX.value =
      (props.pawn.lastPosition.col - props.pawn.position.col) * caseSize.value + 'px'
    translateY.value =
      (props.pawn.lastPosition.row - props.pawn.position.row) * caseSize.value + 'px'

    setTimeout(() => {
      transition.value = true
      translateX.value = '0px'
      translateY.value = '0px'

      setTimeout(() => {
        transition.value = false
      }, 600)
    }, 10)
  }
})
</script>

<template>
  <PawnDisplay
    ref="pawnRef"
    :sizeClass="'size-11/12'"
    :colorClass="pawnColor"
    :orientationClass="pawnOrientation"
    :class="{
      'opacity-60': targetPawn === pawn,
      'cursor-pointer': isPlayerTurn && pawn.owner === playerRole,
      'outline outline-3 outline-light':
        isPlayerTurn && pawn.owner === playerRole && pawn.remainingMove > 0,
      'transition-transform duration-500 ease-in-out': transition,
      'outline outline-pulling': pawn.lastAction === Action.Pull && transition,
      'outline outline-pushing': pawn.lastAction === Action.Push && transition,
      'outline outline-killing': pawn.lastAction === Action.Kill && transition
    }"
    :style="{ transform: `translate(${translateX}, ${translateY})` }"
  >
    <p
      class="text-light font-primary_bold absolute top-0 left-0 px-1 md:px-3 md:py-2"
      :class="remainingMoveOrientation"
    >
      {{ pawn.remainingMove }}
    </p>
  </PawnDisplay>
</template>
