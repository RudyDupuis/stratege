<script setup lang="ts">
import { Pawn } from '@shared/entities/Pawn'
import { Orientation, Player } from '@shared/Enum'
import { computed, type PropType } from 'vue'

const props = defineProps({
  pawn: { type: Object as PropType<Pawn>, required: true }
})

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
  <div
    class="relative size-11/12 rounded-lg overflow-hidden"
    :class="[pawnColor, pawnOrientation].join(' ')"
  >
    <p class="text-warning z-10 absolute px-4 py-2" :class="remainingMoveOrientation">
      {{ pawn.remainingMove }}
    </p>
    <div class="absolute inset-0 bg-dark clip-triangle"></div>
  </div>
</template>

<style scoped>
.clip-triangle {
  clip-path: polygon(0 0, 100% 0, 0 100%);
}
</style>
