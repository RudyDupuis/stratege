<script setup lang="ts">
defineProps<{
  sizeClass: string
  borderPaddingClass?: string
  rows: number
  cols: number
}>()
</script>

<template>
  <div :class="`${borderPaddingClass} rounded-xl bg-dark_light size-fit`">
    <div
      :class="`grid border border-dark ${sizeClass}`"
      :style="{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`
      }"
    >
      <div v-for="(_, rowIndex) in rows" :key="rowIndex" class="contents">
        <div
          v-for="(_, colIndex) in cols"
          :key="colIndex"
          class="flex justify-center items-center border border-dark relative"
        >
          <slot :name="`${rowIndex}-${colIndex}`" />
        </div>
      </div>
    </div>
  </div>
</template>
