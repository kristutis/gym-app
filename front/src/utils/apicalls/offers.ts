import { DEFAULT_BACKEND_PATH } from '../../App'
import { getErrorMsg } from './errors'

export const getOffersCall = async (): Promise<string | Offer[]> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + '/offers', {
    method: 'GET',
  })

  const responseBody = await response.json()
  if (response.status === 200) {
    return Promise.resolve(responseBody as Offer[])
  }

  return Promise.reject(getErrorMsg(responseBody))
}

export const adminGetOffersCall = async (
  authToken: string
): Promise<string | Offer[]> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + '/offers/admin', {
    method: 'GET',
    headers: {
      Authorization: authToken,
    },
  })

  const responseBody = await response.json()
  if (response.status === 200) {
    return Promise.resolve(responseBody as Offer[])
  }

  return Promise.reject(getErrorMsg(responseBody))
}

export const updateOfferCall = async (
  payload: Offer,
  authToken: string
): Promise<string> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + `/offers`, {
    method: 'PUT',
    headers: {
      Authorization: authToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (response.status === 200) {
    return Promise.resolve('')
  }

  const responseBody = await response.json()
  return Promise.reject(getErrorMsg(responseBody))
}

export const postOfferCall = async (
  payload: Offer,
  authToken: string
): Promise<string> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + `/offers`, {
    method: 'POST',
    headers: {
      Authorization: authToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (response.status === 201) {
    return Promise.resolve('')
  }

  const responseBody = await response.json()
  return Promise.reject(getErrorMsg(responseBody))
}

export const deleteOfferCall = async (
  id: number,
  authToken: string
): Promise<string> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + `/offers/${id}`, {
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

export interface Offer {
  id?: number
  imageSrc: string
  discountPercentage: number
  description: string
}
