import { ErrorToDisplay, useErrorsStore } from '@/composables/error/useErrorsStore'

export interface SocketResponse {
  error?: string
}

export function handleSocketResponse(response: SocketResponse) {
  if (response.error) {
    useErrorsStore().addError(new ErrorToDisplay(response.error))
  }
}
