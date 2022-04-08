import { DEFAULT_BACKEND_PATH } from '../../App'
import { getErrorMsg } from './errors'
import { Trainer } from './user'

export const getTrainersCall = async (): Promise<string | Trainer[]> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + '/trainers', {
    method: 'GET',
  })

  const responseBody = await response.json()
  if (response.status === 200) {
    return Promise.resolve(responseBody as Trainer[])
  }

  return Promise.reject(getErrorMsg(responseBody))
}

export const getTrainerImgCall = async (uid: string): Promise<string> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + `/trainers/${uid}/img`, {
    method: 'GET',
  })

  const responseBody = await response.json()
  if (response.status === 200) {
    return Promise.resolve(responseBody.photoUrl.photoUrl)
  }

  return Promise.reject(getErrorMsg(responseBody))
}
