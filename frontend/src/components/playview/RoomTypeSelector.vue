<script setup lang="ts">
const roomType = defineModel<'private' | 'public' | undefined>()
</script>

<template>
  <button @click="roomType = 'public'">Trouver un adversaire</button>
  <button @click="roomType = 'private'">Jouer avec un ami</button>
</template>
