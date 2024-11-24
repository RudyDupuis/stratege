import { defineStore } from 'pinia'
import { ref } from 'vue'

export class ErrorToDisplay extends Error {}

export const useErrorsStore = defineStore('errors', () => {
  const errors = ref<ErrorToDisplay[]>([])

  function addError(error: ErrorToDisplay) {
    errors.value.push(error)
  }

  function removeError(error: ErrorToDisplay) {
    errors.value = errors.value.filter((currentError) => currentError !== error)
  }

  return { errors, addError, removeError }
})
