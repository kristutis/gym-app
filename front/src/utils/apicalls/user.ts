import { DEFAULT_BACKEND_PATH } from '../../App'
import { getErrorMsg } from './errors'

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
  phone: string
}
