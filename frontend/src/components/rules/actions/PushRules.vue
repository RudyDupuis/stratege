<script setup lang="ts">
import PawnComponent from '@/components/boardgame/subcomponents/PawnComponent.vue'
import { GameState } from '@shared/entities/GameState'
import BoardGameDrawing from '../BoardGameDrawing.vue'
import CrossSvg from '@/components/svgs/CrossSvg.vue'
</script>

<template>
  <section>
    <h3 class="small-title mb-5">Pousser</h3>
    <p class="mb-1">
      Si un pion est <strong>adjacent à un pion allier ou adverse</strong>, il peut le pousser.
    </p>
    <p class="mb-5">Le nombre de déplacement restant du pion va diminuer de 1.</p>
    <div class="flex flex-col items-center justify-center mb-5">
      <BoardGameDrawing sizeClass="w-48 h-10" :rows="1" :cols="5" class="mb-2">
        <template v-slot:0-1>
          <PawnComponent sizeClass="size-11/12" colorClass="bg-light" orientationClass="rotate-0">
            <p class="text-light font-primary_bold absolute top-0 left-0 px-1">
              {{ GameState.MAX_PAWN_MOVEMENT }}
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
        <template v-slot:0-3>
          <div class="size-full bg-pushing"></div>
        </template>
      </BoardGameDrawing>
      <BoardGameDrawing sizeClass="w-48 h-10" :rows="1" :cols="5">
        <template v-slot:0-2>
          <PawnComponent sizeClass="size-11/12" colorClass="bg-light" orientationClass="rotate-0">
            <p class="text-light font-primary_bold absolute top-0 left-0 px-1">
              {{ GameState.MAX_PAWN_MOVEMENT - 1 }}
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
    </div>
    <p class="mb-5">Un pion <strong>ne peut pas pousser plus d'un pion</strong>.</p>
    <div class="flex justify-center mb-5">
      <BoardGameDrawing sizeClass="w-48 h-10" :rows="1" :cols="5">
        <template v-slot:0-1>
          <PawnComponent sizeClass="size-11/12" colorClass="bg-light" orientationClass="rotate-0">
            <p class="text-light font-primary_bold absolute top-0 left-0 px-1">
              {{ GameState.MAX_PAWN_MOVEMENT }}
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
        <template v-slot:0-3>
          <PawnComponent
            sizeClass="size-11/12"
            colorClass="bg-player1"
            orientationClass="rotate-0"
          />
        </template>
        <template v-slot:0-4>
          <div class="size-full bg-pushing absolute inset-0"></div>
          <div class="absolute inset-0 size-full flex justify-center items-center">
            <CrossSvg fillClass="fill-error" class="size-8" />
          </div>
        </template>
      </BoardGameDrawing>
    </div>
    <p>Un pion <strong>ne peut être poussé en dehors du plateau</strong>.</p>
  </section>
</template>
