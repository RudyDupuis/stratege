<script setup lang="ts"></script>

<template>
  <main>
    <h1 class="very-large-title mb-16">Stratège</h1>
    <RouterLink :to="{ name: 'play' }" class="button mb-5">
      <i class="fa-solid fa-gamepad mr-2" />
      Jouer !
    </RouterLink>
    <RouterLink :to="{ name: 'rules' }" class="button mb-5">
      <i class="fa-solid fa-book mr-2" />
      Lire les règles
    </RouterLink>
    <RouterLink :to="{ name: 'ranking' }" class="button">
      <i class="fa-solid fa-ranking-star mr-2" />
      Voir le classement
    </RouterLink>
    <footer
      class="flex flex-col md:flex-row space-y-5 justify-between items-center fixed bottom-0 left-0 w-full py-5 px-10 bg-dark_light"
    >
      <div class="flex flex-col md:flex-row md:space-x-5 items-center">
        <p>
          <a href="https://discord.gg/rKAgbnVEs5"><i class="fa-brands fa-discord mr-1" />Discord</a>
        </p>
        <RouterLink :to="{ name: 'privacy-policy' }">
          <i class="fa-solid fa-user-lock mr-1" />
          Politique de confidentialité
        </RouterLink>
      </div>
      <div class="flex flex-col items-center md:items-end">
        <p class="text-sm">Version beta 0.6.0</p>
        <p class="text-sm">Copyright © {{ new Date().getFullYear() }} Rudy Dupuis</p>
      </div>
    </footer>
  </main>
</template>
