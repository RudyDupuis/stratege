<script setup lang="ts">
import PawnDisplay from '../boardgame/pawns/display/PawnDisplay.vue'
import BoardGameDrawing from './BoardGameDrawing.vue'
</script>

<template>
  <section>
    <h2 class="medium-title mb-5">Le matériel</h2>
    <ul class="flex flex-col items-center space-y-5">
      <li class="flex flex-col items-center space-y-2">
        <p>Un plateau de 8x8 cases</p>
        <BoardGameDrawing sizeClass="size-32" borderPaddingClass="p-2" :rows="8" :cols="8" />
      </li>
      <li class="flex flex-col items-center space-y-2">
        <p>8 pions pour le joueur 1</p>
        <div class="flex space-x-1">
          <PawnDisplay
            v-for="_ in 8"
            sizeClass="size-8"
            colorClass="bg-player1"
            orientationClass="rotate-0"
          />
        </div>
      </li>
      <li class="flex flex-col items-center space-y-2">
        <p>8 pions pour le joueur 2</p>
        <div class="flex space-x-1">
          <PawnDisplay
            v-for="_ in 8"
            sizeClass="size-8"
            colorClass="bg-player2"
            orientationClass="rotate-0"
          />
        </div>
      </li>
    </ul>
  </section>
</template>
