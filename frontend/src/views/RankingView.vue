<script setup lang="ts">
import Loading from '@/components/shared/Loading.vue'
import AvatarFinder from '@/components/user/AvatarFinder.vue'
import { ErrorToDisplay, useErrorsStore } from '@/composables/error/useErrorsStore'
import { useUserStore } from '@/composables/user/useUserStore'
import { getTop100 } from '@/utils/api'
import User from '@shared/user/entities/User'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const users = ref<User[]>([])
const currentUser = storeToRefs(useUserStore()).user
const isLoading = ref(true)

getTop100()
  .then((fetchedUsers) => {
    users.value = fetchedUsers
  })
  .catch(() => {
    useErrorsStore().addError(new ErrorToDisplay('Erreur lors de la récupération du classement'))
  })
  .finally(() => {
    isLoading.value = false
  })
</script>

<template>
  <main>
    <h1 class="large-title mb-5 my-32">Classement</h1>
    <h2 class="medium-title mb-10">Les 100 meilleurs joueurs</h2>
    <Loading v-if="isLoading" class="w-10 h-10" />
    <template v-else>
      <section class="bg-dark_light p-5 rounded-xl shadow-lg mb-10">
        <table class="table-auto border-collapse">
          <thead>
            <tr class="bg-gray-100">
              <th class="py-2 px-4 text-left">Position</th>
              <th class="py-2 px-4 text-left hidden sm:table-cell">Avatar</th>
              <th class="py-2 px-4 text-left">Pseudo</th>
              <th class="py-2 px-4 text-left">Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="user.id" class="border-b">
              <td class="py-2 px-4" :class="{ 'font-primary_bold': user.id === currentUser?.id }">
                {{ index + 1 }}
              </td>
              <td class="py-2 px-4 hidden sm:table-cell">
                <AvatarFinder :avatarId="user.avatarId" class="w-8 h-8" />
              </td>
              <td
                class="py-2 px-4 max-w-36 sm:max-w-full truncate"
                :class="{ 'font-primary_bold': user.id === currentUser?.id }"
              >
                {{ user.pseudo }}
              </td>
              <td class="py-2 px-4" :class="{ 'font-primary_bold': user.id === currentUser?.id }">
                {{ user.eloScore }}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <RouterLink v-button-click-sound :to="{ name: 'play' }" class="button mb-5">
        <i class="fa-solid fa-gamepad mr-2" />
        Jouer !
      </RouterLink>
    </template>
  </main>
</template>
