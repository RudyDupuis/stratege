<script setup lang="ts">
import { Pawn } from '@shared/entities/Pawn'
import { computed } from 'vue'

const props = defineProps({
  pawn: { type: Pawn, required: true }
})

const pawnColor = computed(() => {
  switch (props.pawn.owner) {
    case 'player1':
      return 'bg-player1'
    case 'player2':
      return 'bg-player2'
  }
})

const pawnOrientation = computed(() => {
  switch (props.pawn.orientation) {
    case 'NW':
      return 'rotate-0'
    case 'SE':
      return 'rotate-180'
    case 'NE':
      return 'rotate-90'
    case 'SW':
      return 'rotate-270'
  }
})
</script>

<template>
  <div
    class="relative size-11/12 rounded-lg overflow-hidden"
    :class="[pawnColor, pawnOrientation].join(' ')"
  >
    <div class="absolute inset-0 bg-dark clip-triangle"></div>
  </div>
</template>

<style scoped>
.clip-triangle {
  clip-path: polygon(0 0, 100% 0, 0 100%);
}
</style>
