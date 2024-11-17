<script setup lang="ts">
const errorMessage = defineModel<string | undefined>()
</script>

<template>
  <div
    v-if="errorMessage"
    class="font-primary_bold fixed bottom-4 bg-error p-4 rounded shadow-lg mx-6 z-50"
  >
    {{ errorMessage }}
    <button class="ml-4 underline" @click="errorMessage = undefined">Fermer</button>
  </div>
</template>
