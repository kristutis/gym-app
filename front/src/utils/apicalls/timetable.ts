import { DEFAULT_BACKEND_PATH } from '../../App'

export const getTimetablesCall = async (
  startDate: Date,
  endDate: Date
): Promise<ReservationWindow[] | string> => {
  const params = { startDate: startDate.getTime(), endDate: endDate.getTime() }
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

export const createTimetableCall = async (
  payload: CreateTimetableCallProps[]
): Promise<string> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + '/timetable', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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

export interface CreateTimetableCallProps {
  startDate: Date | null
  startTime: string | null
  endDate: Date | null
  endTime: string | null
  visitingTime: string | null
  breakTime: string | null
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
