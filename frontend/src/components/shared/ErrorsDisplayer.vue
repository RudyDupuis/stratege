<script setup lang="ts">
import { useErrorsStore } from '@/composables/error/useErrorsStore'
import { storeToRefs } from 'pinia'

const errors = storeToRefs(useErrorsStore()).errors
</script>

<template>
  <div
    v-for="error in errors"
    class="font-primary_bold fixed bottom-4 bg-error p-4 rounded shadow-lg mx-6 z-50"
  >
    {{ error.message }}
    <button class="ml-4 underline" @click="useErrorsStore().removeError(error)">Fermer</button>
  </div>
</template>
