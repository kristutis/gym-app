import { DEFAULT_BACKEND_PATH } from '../../App'
import { getErrorMsg } from './errors'

export const deleteSubscriptionCall = async (
  authToken: string
): Promise<string> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + `/subscriptions`, {
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

export const purchaseSubscriptionCall = async (
  authToken: string,
  subType: string
): Promise<string> => {
  const response = await fetch(
    DEFAULT_BACKEND_PATH + `/subscriptions/${subType}`,
    {
      method: 'POST',
      headers: {
        Authorization: authToken,
      },
    }
  )

  if (response.status === 200) {
    return Promise.resolve('')
  }

  const responseBody = await response.json()
  return Promise.reject(getErrorMsg(responseBody))
}

export const getSubscriptionTypesCall = async (): Promise<
  string | SubscriptionType[]
> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + '/subscriptions/types', {
    method: 'GET',
  })

  const responseBody = await response.json()
  if (response.status === 200) {
    return Promise.resolve(responseBody)
  }

  return Promise.reject(getErrorMsg(responseBody))
}

export const getSubscriptionsCountCall = async (
  authToken: string
): Promise<string | SubscriptionsCount[]> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + '/subscriptions/stats', {
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

export interface SubscriptionType {
  name: string
  price: number
  startTime: string
  endTime: string
  validDays: number
}

export interface SubscriptionsCount {
  name: string
  count: number
}
