import { DEFAULT_BACKEND_PATH } from '../../App'

export const createTimetableCall = async (
  payload: CreateTimetableProps
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

export interface CreateTimetableProps {
  startDate: Date
  startTime: string
  endDate: Date
  endTime: string
  visitingTime: string
  breakTime: string
  excludeWeekends: boolean
  limitVisitors: boolean
  visitorsCount?: number
}
