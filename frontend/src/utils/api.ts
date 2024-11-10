import type User from '@shared/user/entities/User'
import type UserDto from '@shared/user/entities/UserDto'
import { userDtoToEntity, userToDto } from '@shared/user/mappers/userMapper'

const backendUrl = import.meta.env.VITE_BACKEND_URL

function createHeaders() {
  const headers = new Headers()
  headers.append('Authorization', `Bearer ${localStorage.getItem('token')}`)
  headers.append('Content-Type', 'application/json')
  return headers
}

export async function getMe() {
  const rawMe = await fetch(backendUrl + 'user/me', {
    method: 'GET',
    headers: createHeaders()
  })

  if (rawMe.status !== 200) {
    throw new Error(rawMe.statusText)
  }

  const meDto = (await rawMe.json()) as UserDto

  return userDtoToEntity(meDto)
}

export async function patchMe(user: User) {
  const oldMeDto = userToDto(user)

  const newRawMe = await fetch(backendUrl + 'user/me', {
    method: 'PATCH',
    headers: createHeaders(),
    body: JSON.stringify({
      pseudo: oldMeDto.pseudo,
      pictureId: oldMeDto.pictureId
    })
  })

  if (newRawMe.status !== 200) {
    throw new Error(newRawMe.statusText)
  }

  const newMeDto = (await newRawMe.json()) as UserDto

  return userDtoToEntity(newMeDto)
}
