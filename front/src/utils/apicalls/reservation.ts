import { DEFAULT_BACKEND_PATH } from '../../App'
import { getErrorMsg } from './errors'

export const getUserReservationAvailabilityCall = async (
  startDate: Date,
  endDate: Date,
  authToken: string
): Promise<ReservationsAvailabilityDetails | string> => {
  const params = { startDate, endDate }
  const url: string =
    DEFAULT_BACKEND_PATH +
    '/reservations/availability?' +
    new URLSearchParams(params as any)

  const response = await fetch(url, {
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

export const getUserReservationIdsCall = async (
  authToken: string
): Promise<string | number[]> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + '/reservations', {
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
  resId: number,
  authToken: string
): Promise<string> => {
  const response = await fetch(
    DEFAULT_BACKEND_PATH + `/reservations/${resId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: authToken,
      },
    }
  )

  if (response.status === 204) {
    return Promise.resolve('')
  }

  const responseBody = await response.json()
  return Promise.reject(getErrorMsg(responseBody))
}

export const createReservationCall = async (
  resId: number,
  sendMessage: boolean,
  authToken: string
): Promise<string> => {
  const payload = {
    sendMessage,
  }
  const response = await fetch(
    DEFAULT_BACKEND_PATH + `/reservations/${resId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken,
      },
      body: JSON.stringify(payload),
    }
  )

  if (response.status === 201) {
    return Promise.resolve('')
  }

  const responseBody = await response.json()
  console.log(responseBody)

  return Promise.reject(getErrorMsg(responseBody))
}

export interface ReservationsAvailabilityProps {
  startDate: string
  endDate: string
  reachedMonthlyLimit: boolean
}

export interface ReservationsAvailabilityDetails {
  availability: ReservationsAvailabilityProps[]
  maxMonthlyReservationsCount: number
}
