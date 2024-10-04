import type { Ref } from 'vue'

export interface SocketResponse {
  error?: string
}

export function handleSocketResponse(
  errorMessage: Ref<string | undefined>,
  response: SocketResponse
) {
  if (response.error) {
    errorMessage.value = response.error
  }
}
