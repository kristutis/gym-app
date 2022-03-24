import { DEFAULT_BACKEND_PATH } from '../../App'
import { AuthorisationInfo } from '../auth'
import { getErrorMsg } from './errors'

export const refreshUserCall = async (
  refreshToken: string
): Promise<string | AuthorisationInfo> => {
  const payload = {
    refreshToken,
  }
  const response = await fetch(DEFAULT_BACKEND_PATH + '/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  console.log(response.status)
  const responseBody = await response.json()
  if (response.status === 200) {
    return Promise.resolve(responseBody)
  }

  return Promise.reject(getErrorMsg(responseBody))
}

export const loginUserCall = async (payload: LoginUserProps): Promise<any> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const responseBody = await response.json()
  if (response.status === 200) {
    return Promise.resolve(responseBody)
  }

  return Promise.reject(getErrorMsg(responseBody))
}

export interface LoginUserProps {
  email: string
  password: string
}
