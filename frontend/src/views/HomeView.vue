<script setup lang="ts"></script>

<template>
  <main>
    <h1 class="very-large-title mb-16">Stratège</h1>
    <RouterLink :to="{ name: 'play' }" class="button mb-5">Jouer !</RouterLink>
    <RouterLink :to="{ name: 'rules' }" class="button">Lire les règles</RouterLink>
    <footer
      class="flex justify-between items-center fixed bottom-0 left-0 w-full py-5 px-10 bg-dark_light"
    >
      <p class="underline"><a href="https://discord.gg/rKAgbnVEs5">Discord</a></p>
      <div>
        <p class="text-sm">Version beta 0.1.0</p>
        <p class="text-sm">Copyright © {{ new Date().getFullYear() }} Rudy Dupuis</p>
      </div>
    </footer>
  </main>
</template>
