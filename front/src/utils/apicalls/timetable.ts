import { DEFAULT_BACKEND_PATH } from '../../App'

export const createTimetableCall = async (
  payload: CreateTimetableCallProps[]
): Promise<string> => {
  console.log(payload)
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
