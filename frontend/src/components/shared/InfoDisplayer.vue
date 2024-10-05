<script setup lang="ts">
const message = defineModel<string | undefined>()
</script>

<template>
  <div v-if="message" class="font-primary_bold fixed bottom-4 bg-info p-4 rounded shadow-lg mx-6">
    {{ message }}
    <button class="ml-4 underline" @click="message = undefined">Fermer</button>
  </div>
</template>
