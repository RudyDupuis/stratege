import { ErrorToDisplay, useErrorsStore } from '@/composables/error/useErrorsStore'
import { isUndefined } from '@shared/utils/TypeGuard'
import { inject } from 'vue'

/**
 * Use only if T is not undefined or hasn't an undefined value
 */
export function requiredInject<T>(key: string): T {
  const injected = inject<T>(key)
  if (isUndefined(injected)) {
    throw useErrorsStore().addError(
      new ErrorToDisplay(`Injection manquante pour la clé : "${key}"`)
    )
  }
  return injected
}
