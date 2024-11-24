<script setup lang="ts">
import PawnDisplay from '@/components/boardgame/pawns/display/PawnDisplay.vue'
</script>

<template>
  <section class="mb-16">
    <h3 class="small-title mb-5">Orienter</h3>
    <p class="mb-5">
      Chaque pion peut être <strong>orienté plusieurs fois</strong> pendant le tour de jeu.
    </p>
    <div class="flex space-x-8 justify-center items-center">
      <PawnDisplay sizeClass="size-10" colorClass="bg-dark_light" orientationClass="rotate-0" />
      <PawnDisplay sizeClass="size-10" colorClass="bg-dark_light" orientationClass="rotate-90" />
      <PawnDisplay sizeClass="size-10" colorClass="bg-dark_light" orientationClass="rotate-270" />
      <PawnDisplay sizeClass="size-10" colorClass="bg-dark_light" orientationClass="rotate-180" />
    </div>
  </section>
</template>
