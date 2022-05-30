import { DEFAULT_BACKEND_PATH } from '../../App'
import { getErrorMsg } from './errors'

export const updateTimetableCall = async (
  payload: ReservationWindow,
  authToken: string
): Promise<string> => {
  payload.limitedSpace = !!payload.limitedSpace ? true : false
  const response = await fetch(DEFAULT_BACKEND_PATH + '/timetable', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authToken,
    },
    body: JSON.stringify(payload),
  })

  if (response.status === 200) {
    return Promise.resolve('')
  }

  const responseBody = await response.json()
  return Promise.reject(getErrorMsg(responseBody))
}

export const deleteTimetableByIdCall = async (
  id: number,
  authToken: string
): Promise<string> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + `/timetable/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: authToken,
    },
  })

  if (response.status === 204) {
    return Promise.resolve('')
  }

  const responseBody = await response.json()
  return Promise.reject(getErrorMsg(responseBody))
}

export const deleteTimetableCall = async (
  startDate: Date,
  endDate: Date,
  authToken: string
): Promise<string> => {
  const params = { startDate, endDate }
  const url: string =
    DEFAULT_BACKEND_PATH + '/timetable?' + new URLSearchParams(params as any)

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authToken,
    },
  })

  if (response.status === 204) {
    return Promise.resolve('')
  }

  const responseBody = await response.json()
  return Promise.reject(getErrorMsg(responseBody))
}

export const getTimetablesCall = async (
  startDate: Date,
  endDate: Date
): Promise<ReservationWindow[] | string> => {
  const params = { startDate, endDate }
  const url: string =
    DEFAULT_BACKEND_PATH + '/timetable?' + new URLSearchParams(params as any)

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const responseBody = await response.json()
  if (response.status === 200) {
    return Promise.resolve(responseBody as ReservationWindow[])
  }

  return Promise.reject(getErrorMsg(responseBody))
}

export const createTimetableCall = async (
  payload: CreateTimetableCallProps[],
  authToken: string
): Promise<string> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + '/timetable', {
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

export interface CreateTimetableCallProps {
  startDate: Date | null
  startTime: string | null
  endDate: Date | null
  endTime: string | null
  visitingTime: string | null
  breakTime: string | null
  weekdays?: number[]
  excludeWeekends: boolean
  onlyWeekends: boolean
  limitVisitors: boolean
  visitorsCount?: number
}

export interface ReservationWindow {
  id: number
  startTime: Date
  endTime: Date
  limitedSpace: boolean
  peopleCount?: number
}
