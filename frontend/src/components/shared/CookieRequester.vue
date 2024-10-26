<script setup lang="ts">
import { isNotNull } from '@shared/utils/TypeGuard'
import { onMounted, ref } from 'vue'

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
  <div
    v-if="!isDefinedConsent"
    class="font-primary_bold fixed bottom-4 right-4 bg-info p-4 rounded shadow-lg mx-6"
  >
    Des cookies sont utilisés par Google Analitycs pour mesurer le trafic.
    <button class="ml-4 underline" @click="acceptCookies">Accepter</button>
    <button class="ml-4 underline" @click="refuseCookies">Refuser</button>
  </div>
</template>
