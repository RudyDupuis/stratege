<script setup lang="ts">
import Loading from '@/components/shared/Loading.vue'
import AvatarFinder from '@/components/user/AvatarFinder.vue'
import ProfileUpdate from '@/components/user/ProfileUpdate.vue'
import { useUserStore } from '@/composables/user/useUserStore'
import { isDefined } from '@shared/utils/TypeGuard'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'

const userStore = useUserStore()
const { user, isLoading } = storeToRefs(userStore)

const isEditing = ref(false)
</script>

<template>
  <main>
    <h1 class="large-title mb-16 my-32">Mon profil</h1>

    <Loading v-if="isLoading" class="w-10 h-10" />
    <template v-else>
      <template v-if="isDefined(user)">
        <template v-if="!isEditing">
          <section
            v-if="!isEditing"
            class="flex flex-col items-center bg-dark_light p-10 rounded-xl shadow-lg mb-10"
          >
            <AvatarFinder :avatarId="user.avatarId" class="w-40 h-40 mb-3" />
            <h2 class="medium-title mb-5">{{ user.pseudo }}</h2>
            <p class="font-primary_bold">Score ELO : {{ user.eloScore }}</p>
          </section>

          <button v-button-click-sound class="button mb-2" @click="isEditing = true">
            <i class="fa-solid fa-pen-to-square mr-2" />
            Modifier mon profil
          </button>
          <button v-button-click-sound class="danger-button mb-10" @click="userStore.logout">
            <i class="fa-solid fa-power-off mr-2" />
            Se déconnecter
          </button>
        </template>

        <ProfileUpdate v-else @close="isEditing = false" />
      </template>

      <template v-else>
        <p>Vous devez vous connecter pour voir votre profil.</p>
      </template>
    </template>
  </main>
</template>
