<script setup lang="ts">
import { isNotNull } from '@shared/helpers/TypeGuard'
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'

declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

const hasConsent = ref<boolean>(false)
const isDefinedConsent = ref<boolean>(false)

const enableAnalytics = () => {
  if (!hasConsent.value) return
  window.gtag('js', new Date())
  window.gtag('config', 'G-NQXTE21RG7', { anonymize_ip: true })
}

const acceptCookies = () => {
  localStorage.setItem('cookieConsent', 'accepted')
  enableAnalytics()
  isDefinedConsent.value = true
}

const refuseCookies = () => {
  localStorage.setItem('cookieConsent', 'refused')
  isDefinedConsent.value = true
}

onMounted(() => {
  isDefinedConsent.value = isNotNull(localStorage.getItem('cookieConsent'))
  if (isDefinedConsent.value) {
    hasConsent.value = localStorage.getItem('cookieConsent') === 'accepted'
  }
  enableAnalytics()
})
</script>

<template>
  <RouterLink :to="{ name: 'home' }" class="small-title absolute top-5 left-5">Stratège</RouterLink>
  <RouterView />
  <div
    v-if="!isDefinedConsent"
    class="font-primary_bold fixed bottom-4 right-4 bg-info p-4 rounded shadow-lg mx-6"
  >
    Ce site utilise des cookies pour vous offrir la meilleure expérience utilisateur.
    <button class="ml-4 underline" @click="acceptCookies">Accepter</button>
    <button class="ml-4 underline" @click="refuseCookies">Refuser</button>
  </div>
</template>
