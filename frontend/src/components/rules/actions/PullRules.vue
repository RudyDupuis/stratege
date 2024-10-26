<script setup lang="ts">
import PawnComponent from '@/components/boardgame/subcomponents/PawnComponent.vue'
import GameState from '@shared/gameState/entities/GameState'
import BoardGameDrawing from '../BoardGameDrawing.vue'
</script>

<template>
  <section>
    <h3 class="small-title mb-5">Tirer</h3>
    <p class="mb-1">
      Si un pion est <strong>adjacent à un pion allier ou adverse</strong>, il peut le tirer.
    </p>
    <p class="mb-1">
      Pour tirer un pion,
      <strong>une case libre avant le pion est obligatoire</strong>.
    </p>
    <p class="mb-5">Le nombre de déplacement restant du pion va diminuer de 1.</p>
    <div class="flex flex-col items-center justify-center">
      <BoardGameDrawing sizeClass="w-48 h-10" :rows="1" :cols="5" class="mb-5">
        <template v-slot:0-1>
          <div class="size-full bg-pulling"></div>
        </template>
        <template v-slot:0-2>
          <PawnComponent sizeClass="size-11/12" colorClass="bg-light" orientationClass="rotate-0">
            <p class="text-light font-primary_bold absolute top-0 left-0 px-1">
              {{ GameState.MAX_PAWN_MOVEMENT }}
            </p>
          </PawnComponent>
        </template>
        <template v-slot:0-3>
          <PawnComponent
            sizeClass="size-11/12"
            colorClass="bg-player1"
            orientationClass="rotate-0"
          />
        </template>
      </BoardGameDrawing>
      <BoardGameDrawing sizeClass="w-48 h-10" :rows="1" :cols="5">
        <template v-slot:0-1>
          <PawnComponent sizeClass="size-11/12" colorClass="bg-light" orientationClass="rotate-0">
            <p class="text-light font-primary_bold absolute top-0 left-0 px-1">
              {{ GameState.MAX_PAWN_MOVEMENT - 1 }}
            </p>
          </PawnComponent>
        </template>
        <template v-slot:0-2>
          <PawnComponent
            sizeClass="size-11/12"
            colorClass="bg-player1"
            orientationClass="rotate-0"
          />
        </template>
      </BoardGameDrawing>
    </div>
  </section>
</template>
