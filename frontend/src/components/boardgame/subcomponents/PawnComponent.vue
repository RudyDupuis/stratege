<script setup lang="ts">
defineProps<{
  sizeClass: string
  colorClass: string
  orientationClass: string
}>()
</script>

<template>
  <div :class="`relative ${sizeClass} ${colorClass} rounded-xl overflow-hidden`">
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
