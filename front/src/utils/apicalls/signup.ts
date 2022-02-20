import { DEFAULT_BACKEND_PATH } from '../../App'

export const signupUserCall = async (
  payload: SignupUserProps
): Promise<string> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + '/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (response.status === 201) {
    return Promise.resolve('')
  }

  const responseBody = await response.json()
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

export interface SignupUserProps {
  name: string
  surname: string
  email: string
  password: string
}
