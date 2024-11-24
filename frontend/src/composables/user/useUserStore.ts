import router from '@/router'
import { getMe, patchMe } from '@/utils/api'
import type User from '@shared/user/entities/User'
import { userDtoToEntity } from '@shared/user/mappers/userMapper'
import { isNotNull } from '@shared/utils/TypeGuard'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ErrorToDisplay, useErrorsStore } from '../error/useErrorsStore'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | undefined>(undefined)
  const isLoading = ref<boolean>(false)

  async function getUser() {
    if (isNotNull(localStorage.getItem('token'))) {
      isLoading.value = true
      try {
        const rawUser = await getMe()
        user.value = userDtoToEntity(rawUser)
      } catch {
        localStorage.removeItem('token')
        useErrorsStore().addError(
          new ErrorToDisplay("Erreur lors de la récupération de l'utilisateur")
        )
      } finally {
        isLoading.value = false
      }
    }
  }

  async function updateUser(newUser: User) {
    isLoading.value = true
    try {
      const rawUser = await patchMe(newUser)
      user.value = userDtoToEntity(rawUser)
    } catch {
      useErrorsStore().addError(
        new ErrorToDisplay("Erreur lors de la mise à jour de l'utilisateur")
      )
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    localStorage.removeItem('token')
    user.value = undefined
    router.push({ name: 'home' })
  }

  return { user, isLoading, updateUser, getUser, logout }
})
