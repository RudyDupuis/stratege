<script setup lang="ts">
import { useUserStore } from '@/composables/user/useUserStore'
import { isUndefined } from '@shared/utils/TypeGuard'
import { storeToRefs } from 'pinia'
import { computed, ref, useTemplateRef } from 'vue'
import AvatarFinder from './AvatarFinder.vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const avatarFinderComp = useTemplateRef<InstanceType<typeof AvatarFinder>>('avatarFinderComp')
const avatarIndices = computed(() =>
  Array.from({ length: avatarFinderComp.value?.avatars.length || 0 }, (_, i) => i + 1)
)

const newPseudo = ref<string>(user.value?.pseudo || '')
const newProfileAvatar = ref<number>(user.value?.avatarId || 1)

function updateUser() {
  if (isUndefined(user.value)) {
    return
  }

  user.value.pseudo = newPseudo.value
  user.value.avatarId = newProfileAvatar.value
  userStore.updateUser(user.value)
  emit('close')
}
</script>

<template>
  <section>
    <h2 class="medium-title mb-5">Edition du profil</h2>
    <section
      class="flex flex-col items-center bg-dark_light p-5 sm:p-10 rounded-xl shadow-lg mb-10"
    >
      <AvatarFinder ref="avatarFinderComp" :avatarId="newProfileAvatar" class="w-40 h-40 mb-5" />

      <div class="flex justify-center gap-2">
        <button
          v-for="avatarId in avatarIndices"
          :key="avatarId"
          @click="newProfileAvatar = avatarId"
        >
          <AvatarFinder
            :avatarId="avatarId"
            class="w-10 h-10"
            :class="newProfileAvatar === avatarId ? 'opacity-100' : 'opacity-50'"
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
    v-button-click-sound
    :disabled="newPseudo.length < 3 || newPseudo.length > 20"
    class="button mb-2"
    @click="updateUser"
  >
    <i class="fa-solid fa-floppy-disk mr-2" />
    Enregister
  </button>
  <button v-button-click-sound class="danger-button mb-10" @click="emit('close')">Annuler</button>
</template>
