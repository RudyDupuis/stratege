<script setup lang="ts">
const roomType = defineModel<'private' | 'public' | undefined>()
</script>

<template>
  <h1 class="large-title mb-14">Quel type de partie ?</h1>
  <button class="button mb-10" @click="roomType = 'public'">Trouver un adversaire</button>
  <button class="button" @click="roomType = 'private'">Jouer avec un ami</button>
</template>
