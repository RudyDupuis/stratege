<script setup lang="ts">
import PawnDisplay from '@/components/boardgame/pawns/display/PawnDisplay.vue'
import MoveRules from '@/components/rules/actions/MoveRules.vue'
import PullRules from '@/components/rules/actions/PullRules.vue'
import PushRules from '@/components/rules/actions/PushRules.vue'
import RotateRules from '@/components/rules/actions/RotateRules.vue'
import GoalOfTheGame from '@/components/rules/GoalOfTheGame.vue'
import TheMaterial from '@/components/rules/TheMaterial.vue'
import GameState from '@shared/gameState/entities/GameState'
</script>

<template>
  <main>
    <h1 class="large-title my-32">Les règles du jeu</h1>
    <section class="flex flex-col xl:flex-row xl:space-x-60 space-y-16 xl:space-y-0 mb-16 md:mb-32">
      <TheMaterial />
      <GoalOfTheGame />
    </section>
    <section>
      <h2 class="medium-title mb-5">Les actions</h2>
      <p class="mb-1">
        Lors d'un tour de jeu, le joueur peut
        <strong>effectuer des actions sur tout ses pions</strong>.
      </p>
      <p class="mb-1">
        Plusieurs actions peuvent déplacer un pion, et
        <strong
          >chaque pion peut se déplacer d'au maximum
          {{ GameState.MAX_PAWN_MOVEMENT }}
          cases</strong
        >.
      </p>
      <p class="mb-5">
        Le nombre de déplacement restant est représenté sur chaque pion et réinitialisé en fin de
        tour.
      </p>
      <div class="flex justify-center mb-32">
        <PawnDisplay sizeClass="size-16" colorClass="bg-dark_light" orientationClass="rotate-0">
          <p class="text-light font-primary_bold absolute top-0 left-0 px-1 md:px-3 md:py-2">
            {{ GameState.MAX_PAWN_MOVEMENT }}
          </p>
        </PawnDisplay>
      </div>
      <div class="flex flex-col space-y-16 mb-20">
        <div class="flex flex-col xl:flex-row xl:space-x-32 space-x-0 xl:space-y-0 space-y-16">
          <MoveRules />
          <RotateRules />
        </div>
        <div class="flex flex-col xl:flex-row xl:space-x-32 space-x-0 xl:space-y-0 space-y-16">
          <PushRules />
          <PullRules />
        </div>
      </div>
    </section>
    <RouterLink v-button-click-sound :to="{ name: 'play' }" class="button mb-20">
      <i class="fa-solid fa-gamepad mr-2" />
      Jouer !
    </RouterLink>
  </main>
</template>
