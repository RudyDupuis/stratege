<script setup lang="ts">
import { useUserStore } from '@/composables/user/useUserStore'
import { isUndefined } from '@shared/utils/TypeGuard'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import ProfilePicture1Svg from '../svgs/profilePicture/ProfilePicture1Svg.vue'
import ProfilePicture2Svg from '../svgs/profilePicture/ProfilePicture2Svg.vue'
import ProfilePicture3Svg from '../svgs/profilePicture/ProfilePicture3Svg.vue'
import ProfilePicture4Svg from '../svgs/profilePicture/ProfilePicture4Svg.vue'
import ProfilePicture5Svg from '../svgs/profilePicture/ProfilePicture5Svg.vue'
import ProfilePicture6Svg from '../svgs/profilePicture/ProfilePicture6Svg.vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const newPseudo = ref<string>(user.value?.pseudo || '')
const newProfilePicture = ref<number>(user.value?.pictureId || 1)

const profilePictures = [
  ProfilePicture1Svg,
  ProfilePicture2Svg,
  ProfilePicture3Svg,
  ProfilePicture4Svg,
  ProfilePicture5Svg,
  ProfilePicture6Svg
]
const currentProfilePicture = computed(() => profilePictures[newProfilePicture.value - 1])

function updateUser() {
  if (isUndefined(user.value)) {
    return
  }

  user.value.pseudo = newPseudo.value
  user.value.pictureId = newProfilePicture.value
  userStore.updateUser(user.value)
  emit('close')
}
</script>

<template>
  <section>
    <h2 class="medium-title mb-5">Edition du profil</h2>
    <section class="flex flex-col items-center bg-dark_light p-5 sm:p-10 rounded-xl mb-10">
      <component :is="currentProfilePicture" class="w-40 h-40 mb-5" />

      <div class="flex justify-center gap-2">
        <button
          v-for="pictureId in profilePictures.length"
          :key="pictureId"
          @click="newProfilePicture = pictureId"
        >
          <component
            :is="profilePictures[pictureId - 1]"
            :class="newProfilePicture === pictureId ? 'opacity-100' : 'opacity-50'"
            class="w-10 h-10"
          />
        </button>
      </div>
    </section>
    <div class="flex flex-col mb-10">
      <label for="pseudo" class="font-primary_bold mb-2">Nouveau Pseudo</label>
      <input v-model="newPseudo" type="text" id="pseudo" class="input mb-1" maxlength="20" />
      <p v-if="newPseudo.length < 3 || newPseudo.length > 20" class="text-error">
        Le pseudo doit contenir entre 3 et 20 caractères.
      </p>
      <p>
        Attention : Un pseudo injurieux ou inapproprié peut <br />
        entraîner un risque de bannissement.
      </p>
    </div>
  </section>

  <button
    :disabled="newPseudo.length < 3 || newPseudo.length > 20"
    class="button mb-2"
    @click="updateUser"
  >
    Enregister
  </button>
  <button class="button mb-10" @click="emit('close')">Annuler</button>
</template>
