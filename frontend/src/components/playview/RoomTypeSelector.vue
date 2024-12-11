<script setup lang="ts">
import { useUserStore } from '@/composables/user/useUserStore'
import { AiLevel } from '@shared/room/entities/AiLevelEnum'
import { RoomType } from '@shared/room/entities/RoomTypeEnum'
import { isUndefined } from '@shared/utils/TypeGuard'
import { storeToRefs } from 'pinia'

const roomType = defineModel<RoomType | undefined>('roomType')
const aiLevel = defineModel<AiLevel | undefined>('aiLevel')
const user = storeToRefs(useUserStore()).user
</script>

<template>
  <template v-if="roomType !== RoomType.AI">
    <h1 class="large-title mb-14">Quel type de partie ?</h1>

    <button :disabled="isUndefined(user)" class="button" @click="roomType = RoomType.Public">
      <i class="fa-solid fa-trophy mr-2" />
      Partie classée
    </button>
    <p v-if="isUndefined(user)">Pour jouer en partie classée, vous devez vous connecter.</p>

    <button class="button mt-5" @click="roomType = RoomType.Private">
      <i class="fa-solid fa-user-group mr-2" />
      Jouer avec un ami
    </button>

    <button class="button mt-5" @click="roomType = RoomType.AI">
      <i class="fa-solid fa-robot mr-2" />
      Affronter une IA
    </button>
  </template>
  <template v-else>
    <h1 class="large-title mb-14">Quel niveau d'IA ?</h1>

    <button class="button" @click="aiLevel = AiLevel.Easy">
      <i class="fa-solid fa-leaf mr-2" />
      Facile
    </button>

    <button class="button mt-5" @click="aiLevel = AiLevel.Medium">
      <i class="fa-solid fa-scale-balanced mr-2" />
      Moyen
    </button>

    <button class="button mt-5" @click="aiLevel = AiLevel.Hard">
      <i class="fa-solid fa-skull-crossbones mr-2" />
      Difficile
    </button>
  </template>
</template>
