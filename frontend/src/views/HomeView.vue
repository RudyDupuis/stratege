<script setup lang="ts"></script>

<template>
  <main>
    <h1 class="very-large-title mb-16">Stratège</h1>
    <RouterLink :to="{ name: 'play' }" class="button mb-5">Jouer !</RouterLink>
    <RouterLink :to="{ name: 'rules' }" class="button">Lire les règles</RouterLink>
  </main>
</template>
