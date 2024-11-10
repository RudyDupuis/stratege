<template>
  <div
    class="loader border-4 border-t-4 border-t-light border-primary rounded-full animate-spin"
  ></div>
</template>

<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
