import { DEFAULT_BACKEND_PATH } from '../../App'
import { getErrorMsg } from './errors'

export const updateUserCall = async (
  payload: UpdateUserProps,
  authToken: string
): Promise<string> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + '/users', {
    method: 'PUT',
    headers: {
      Authorization: authToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (response.status === 200) {
    return Promise.resolve('')
  }

  const responseBody = await response.json()
  return Promise.reject(getErrorMsg(responseBody))
}

export const getUserDetailsCall = async (
  authToken: string
): Promise<string | User> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + '/users/details', {
    method: 'GET',
    headers: {
      Authorization: authToken,
    },
  })

  const responseBody = await response.json()
  if (response.status === 200) {
    return Promise.resolve(responseBody)
  }

  return Promise.reject(getErrorMsg(responseBody))
}

export interface User {
  id: string
  name: string
  surname: string
  email: string
  hashedPassword?: string
  createDate: Date
  modifyDate: Date
  role: string
  phone?: string
}

export interface UpdateUserProps {
  id: string
  name: string
  surname: string
  phone?: string
  password?: string
}
