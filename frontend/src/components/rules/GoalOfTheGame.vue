<script setup lang="ts">
import GameInformations from '../boardgame/subcomponents/GameInformations.vue'
import PawnComponent from '../boardgame/subcomponents/PawnComponent.vue'
import ArrowSvg from '../svgs/ArrowSvg.vue'
import ShieldSvg from '../svgs/ShieldSvg.vue'
import BoardGameDrawing from './BoardGameDrawing.vue'
</script>

<template>
  <section>
    <h2 class="medium-title mb-5">But du jeu</h2>
    <p class="mb-1"><strong>Le but du jeu est de prendre les 8 pions adverses</strong>.</p>
    <p class="mb-1">
      Pour prendre un pion adverse, il suffit de
      <strong>se déplacer sur la case du pion</strong>.
    </p>
    <p class="mb-1">
      Un pion est <strong>protégé par un bouclier</strong> représenté par le triangle noir.
    </p>
    <p class="mb-5">Il n'est pas possible de prendre un pion du coté de son bouclier.</p>
    <div class="flex justify-center mb-5">
      <BoardGameDrawing sizeClass="size-48" :rows="3" :cols="3">
        <template v-slot:1-1>
          <PawnComponent sizeClass="size-11/12" colorClass="bg-light" orientationClass="rotate-0">
            <ShieldSvg fillClass="fill-light" class="size-8 px-2" />
          </PawnComponent>
        </template>
        <template v-slot:0-1>
          <ArrowSvg fillClass="fill-error" class="size-8 rotate-180" />
        </template>
        <template v-slot:1-0>
          <ArrowSvg fillClass="fill-error" class="size-8 rotate-90" />
        </template>
        <template v-slot:2-1>
          <ArrowSvg fillClass="fill-succes" class="size-8" />
        </template>
        <template v-slot:1-2>
          <ArrowSvg fillClass="fill-succes" class="size-8 rotate-270" />
        </template>
      </BoardGameDrawing>
    </div>
    <p class="mb-1">
      <strong>La partie se termine lorsqu'un joueur n'a plus de pion</strong>. Il aura perdu.
    </p>
    <p class="mb-5">Les informations de la partie sont présentes au dessus du plateau.</p>
    <div class="flex justify-center mb-5">
      <GameInformations :turn="5" :player1s-lost-pawns-number="0" :player2s-lost-pawns-number="3" />
    </div>
    <p>On y retrouve le tour actuel du jeu et le nombre de pions restants pour chaque joueur.</p>
  </section>
</template>
