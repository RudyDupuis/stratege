<script setup lang="ts">
import { Pawn } from '@shared/entities/Pawn'
import { Orientation, Player } from '@shared/Enum'
import { computed } from 'vue'
import PawnComponent from './subcomponents/PawnComponent.vue'

const props = defineProps<{
  pawn: Pawn
  player: Player
}>()

const pawnColor = computed(() => {
  switch (props.pawn.owner) {
    case Player.Player1:
      return 'bg-player1'
    case Player.Player2:
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
  if (props.player === Player.Player2) {
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
</script>

<template>
  <PawnComponent
    :sizeClass="'size-11/12'"
    :colorClass="pawnColor"
    :orientationClass="pawnOrientation"
  >
    <p
      class="text-light font-primary_bold z-10 absolute top-0 left-0 px-1 md:px-3 md:py-2"
      :class="remainingMoveOrientation"
    >
      {{ pawn.remainingMove }}
    </p>
  </PawnComponent>
</template>
