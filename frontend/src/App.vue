<script setup lang="ts">
import { ref } from 'vue'
import CookieRequester from './components/shared/CookieRequester.vue'
import InfoDisplayer from './components/shared/InfoDisplayer.vue'
import HeaderComp from './components/shared/HeaderComp.vue'
import ErrorsDisplayer from './components/shared/ErrorsDisplayer.vue'

const message = ref<string | undefined>(import.meta.env.VITE_INFO_MESSAGE)
</script>

<template>
  <HeaderComp />
  <RouterView />
  <CookieRequester />
  <InfoDisplayer v-model="message" />
  <ErrorsDisplayer />
</template>
