import type UserDto from '@shared/user/entities/UserDto'
import { userDtoToEntity } from '@shared/user/mappers/userMapper'

const backendUrl = import.meta.env.VITE_BACKEND_URL
export async function getMe() {
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)

  const rawMe = await fetch(backendUrl + 'user/me', {
    method: 'GET',
    headers
  })
  const meDto = (await rawMe.json()) as UserDto

  return userDtoToEntity(meDto)
}
