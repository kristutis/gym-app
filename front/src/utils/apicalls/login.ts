import { DEFAULT_BACKEND_PATH } from '../../App'

export const loginUserCall = async (
  payload: LoginUserProps
): Promise<string> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  console.log('dasd')

  const responseBody = await response.json()
  if (response.status === 200) {
    //user logic
    return Promise.resolve('')
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
