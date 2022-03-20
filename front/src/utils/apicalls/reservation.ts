import { DEFAULT_BACKEND_PATH } from '../../App'

export const createReservationCall = async (
  payload: CreateReservationCallProps,
  authToken: string
): Promise<string> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + '/reservation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authToken,
    },
    body: JSON.stringify(payload),
  })

  const responseBody = await response.json()
  if (response.status === 200) {
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

export interface CreateReservationCallProps {
  reservationId: number
}
