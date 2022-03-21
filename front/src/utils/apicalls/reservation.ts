import { DEFAULT_BACKEND_PATH } from '../../App'
import { getErrorMsg } from './errors'

export const getUserReservationIdsCall = async (
  authToken: string
): Promise<string | number[]> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + '/reservation', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authToken,
    },
  })

  const responseBody = await response.json()
  if (response.status === 200) {
    return Promise.resolve(responseBody)
  }

  return Promise.reject(getErrorMsg(responseBody))
}

export const deleteReservationCall = async (
  payload: DeleteReservationCallProps,
  authToken: string
): Promise<string> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + '/reservation', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authToken,
    },
    body: JSON.stringify(payload),
  })

  if (response.status === 204) {
    return Promise.resolve('')
  }

  const responseBody = await response.json()
  return Promise.reject(getErrorMsg(responseBody))
}

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

  if (response.status === 201) {
    return Promise.resolve('')
  }

  const responseBody = await response.json()
  return Promise.reject(getErrorMsg(responseBody))
}

export interface CreateReservationCallProps {
  reservationId: number
}

export interface DeleteReservationCallProps {
  reservationId: number
}
