import { DEFAULT_BACKEND_PATH } from '../../App'
import { getErrorMsg } from './errors'

export const getAllTrainerRatingsCall = async (
  trainerId: string
): Promise<string | number[]> => {
  const response = await fetch(
    DEFAULT_BACKEND_PATH + `/trainers/${trainerId}/ratings/all`,
    {
      method: 'GET',
    }
  )

  const responseBody = await response.json()
  if (response.status === 200) {
    return Promise.resolve(responseBody as number[])
  }

  return Promise.reject(getErrorMsg(responseBody))
}

export const getUserRatingsForTrainerCall = async (
  trainerId: string,
  authToken: string
): Promise<string | number> => {
  const response = await fetch(
    DEFAULT_BACKEND_PATH + `/trainers/${trainerId}/ratings`,
    {
      method: 'GET',
      headers: {
        Authorization: authToken,
      },
    }
  )

  const responseBody = await response.json()
  if (response.status === 200) {
    return Promise.resolve(responseBody as number)
  }

  return Promise.reject(getErrorMsg(responseBody))
}

export const postRatingCall = async (
  trainerId: string,
  rating: number,
  authToken: string
): Promise<string | number> => {
  const response = await fetch(
    DEFAULT_BACKEND_PATH + `/trainers/${trainerId}/ratings/${rating}`,
    {
      method: 'POST',
      headers: {
        Authorization: authToken,
      },
    }
  )

  if (response.status === 201 || response.status === 200) {
    return Promise.resolve('')
  }

  const responseBody = await response.json()
  return Promise.reject(getErrorMsg(responseBody))
}
