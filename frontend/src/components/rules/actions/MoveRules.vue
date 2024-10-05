<script setup lang="ts">
import PawnComponent from '@/components/boardgame/subcomponents/PawnComponent.vue'
import BoardGameDrawing from '../BoardGameDrawing.vue'
</script>

<template>
  <section>
    <h3 class="small-title mb-5">Se déplacer</h3>
    <p class="mb-5">
      Chaque pion peut avancer de <strong>0, 1 ou 2 cases selon le choix du joueur</strong>.
    </p>
    <div class="flex justify-center">
      <BoardGameDrawing sizeClass="size-48" :rows="5" :cols="5">
        <template v-slot:2-2>
          <PawnComponent sizeClass="size-11/12" colorClass="bg-light" orientationClass="rotate-0" />
        </template>
        <template v-slot:0-2>
          <div class="size-full bg-moving"></div>
        </template>
        <template v-slot:1-1>
          <div class="size-full bg-moving"></div>
        </template>
        <template v-slot:1-2>
          <div class="size-full bg-moving"></div>
        </template>
        <template v-slot:1-3>
          <div class="size-full bg-moving"></div>
        </template>
        <template v-slot:2-0>
          <div class="size-full bg-moving"></div>
        </template>
        <template v-slot:2-1>
          <div class="size-full bg-moving"></div>
        </template>
        <template v-slot:2-3>
          <div class="size-full bg-moving"></div>
        </template>
        <template v-slot:2-4>
          <div class="size-full bg-moving"></div>
        </template>
        <template v-slot:3-1>
          <div class="size-full bg-moving"></div>
        </template>
        <template v-slot:3-2>
          <div class="size-full bg-moving"></div>
        </template>
        <template v-slot:3-3>
          <div class="size-full bg-moving"></div>
        </template>
        <template v-slot:4-2>
          <div class="size-full bg-moving"></div>
        </template>
      </BoardGameDrawing>
    </div>
  </section>
</template>
