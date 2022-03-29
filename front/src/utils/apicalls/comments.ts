import { DEFAULT_BACKEND_PATH } from '../../App'
import { getErrorMsg } from './errors'

export const getTrainerCommentsCall = async (
  trainerId: string
): Promise<string | TrainerComment[]> => {
  const response = await fetch(
    DEFAULT_BACKEND_PATH + `/trainers/${trainerId}/comments`,
    {
      method: 'GET',
    }
  )

  const responseBody = await response.json()
  if (response.status === 200) {
    return Promise.resolve(responseBody as TrainerComment[])
  }

  return Promise.reject(getErrorMsg(responseBody))
}

export const postCommentCall = async (
  trainerId: string,
  comment: string,
  authToken: string
): Promise<string | number> => {
  const payload = {
    comment,
  }
  const response = await fetch(
    DEFAULT_BACKEND_PATH + `/trainers/${trainerId}/comments`,
    {
      method: 'POST',
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )

  if (response.status === 201) {
    return Promise.resolve('')
  }

  const responseBody = await response.json()
  return Promise.reject(getErrorMsg(responseBody))
}

export const deleteCommentCall = async (
  commentId: number,
  authToken: string
): Promise<string> => {
  const response = await fetch(
    DEFAULT_BACKEND_PATH + `/comments/${commentId}`,
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

export const updateCommentCall = async (
  commentId: number,
  comment: string,
  authToken: string
): Promise<string> => {
  const payload = {
    comment,
  }
  const response = await fetch(
    DEFAULT_BACKEND_PATH + `/comments/${commentId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )

  if (response.status === 200) {
    return Promise.resolve('')
  }

  const responseBody = await response.json()
  return Promise.reject(getErrorMsg(responseBody))
}

export interface TrainerComment {
  id: number
  userId: string
  comment: string
  createDate: string
  creatorName: string
}
