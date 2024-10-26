<script setup lang="ts">
import { computed, ref } from 'vue'

defineProps<{
  sizeClass: string
  colorClass: string
  orientationClass: string
}>()

const pawnRef = ref<HTMLElement | undefined>(undefined)

const size = computed(() => {
  return pawnRef.value?.clientWidth || 0
})

defineExpose({
  size
})
</script>

<template>
  <div ref="pawnRef" :class="`relative ${sizeClass} ${colorClass} rounded-xl overflow-hidden`">
    <div :class="`absolute inset-0 bg-dark clip-triangle ${orientationClass}`">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.clip-triangle {
  clip-path: polygon(0 0, 100% 0, 0 100%);
}
</style>
