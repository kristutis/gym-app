import { DEFAULT_BACKEND_PATH } from '../../App'

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

  if (
    responseBody?.error?.message &&
    typeof responseBody.error.message === 'string'
  ) {
    return Promise.reject(responseBody.error.message)
  }

  if (responseBody?.error?.message?.details[0]?.message) {
    return Promise.reject(responseBody?.error?.message?.details[0]?.message)
  }

  return Promise.reject('Unhandled exception')
}

export interface LoginUserProps {
  email: string
  password: string
}
