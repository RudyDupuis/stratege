<script setup lang="ts">
import ErrorDisplayer from '@/components/shared/ErrorDisplayer.vue'
import Loading from '@/components/shared/Loading.vue'
import { useUserStore } from '@/composables/user/useUserStore'
import { getTop100 } from '@/utils/api'
import User from '@shared/user/entities/User'
import { isDefined } from '@shared/utils/TypeGuard'
import { storeToRefs } from 'pinia'
import { defineAsyncComponent, ref } from 'vue'

const users = ref<User[]>([])
const currentUser = storeToRefs(useUserStore()).user
const isLoading = ref(true)
const errorMessage = ref<string | undefined>(undefined)

getTop100()
  .then((fetchedUsers) => {
    users.value = fetchedUsers
  })
  .catch(() => {
    errorMessage.value = 'Erreur lors de la récupération du classement'
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
      <section class="bg-dark_light p-5 rounded-xl shadow-lg">
        <p>{{ currentUser?.pseudo }}</p>
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
            <tr
              v-for="(user, index) in users"
              :key="user.id"
              class="border-b"
              :class="{ 'bg-light': user.id === currentUser?.id }"
            >
              <td class="py-2 px-4">{{ index + 1 }}</td>
              <td class="py-2 px-4 hidden sm:table-cell">
                <div class="bg-dark_light p-2 rounded-full">
                  <component
                    :is="
                      defineAsyncComponent(
                        () =>
                          import(
                            `@/components/svgs/profilePicture/ProfilePicture${user?.pictureId}Svg.vue`
                          )
                      )
                    "
                    class="w-8 h-8"
                  />
                </div>
              </td>
              <td class="py-2 px-4 max-w-36 sm:max-w-full truncate">{{ user.pseudo }}</td>
              <td class="py-2 px-4">{{ user.elo_score }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </main>
  <ErrorDisplayer v-if="isDefined(errorMessage)" v-model="errorMessage" />
</template>
