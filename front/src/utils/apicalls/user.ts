import { DEFAULT_BACKEND_PATH } from '../../App'
import { getErrorMsg } from './errors'

export const DEFAULT_PROFILE_PIC_SRC = '/images/profile-picture.png'

export const adminGetUsersCall = async (
  authToken: string
): Promise<string | Trainer[]> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + '/users', {
    method: 'GET',
    headers: {
      Authorization: authToken,
    },
  })

  const responseBody = await response.json()
  if (response.status === 200) {
    return Promise.resolve(responseBody as Trainer[])
  }

  return Promise.reject(getErrorMsg(responseBody))
}

export const adminUpdateUserCall = async (
  payload: AdminUpdateUserProps,
  authToken: string
): Promise<string> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + '/users/admin', {
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

export const updateUserCall = async (
  payload: UpdateUserProps,
  authToken: string
): Promise<string> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + '/users', {
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

export const getUserDetailsCall = async (
  authToken: string
): Promise<string | User> => {
  const response = await fetch(DEFAULT_BACKEND_PATH + '/users/details', {
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

export const adminDeleteUserCall = async (
  uid: string,
  authToken: string
): Promise<string> => {
  const payload = {
    uid,
  }
  const response = await fetch(DEFAULT_BACKEND_PATH + '/users/' + uid, {
    method: 'DELETE',
    headers: {
      Authorization: authToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (response.status === 204) {
    return Promise.resolve('')
  }

  const responseBody = await response.json()
  return Promise.reject(getErrorMsg(responseBody))
}

export interface User {
  id: string
  name: string
  surname: string
  email: string
  hashedPassword?: string
  createDate: Date
  modifyDate: Date
  role: string
  balance: number
  phone?: string
  subscriptionName?: string
  subscriptionValidUntil?: string
  subscriptionStartTime?: string
  subscriptionEndTime?: string
}

export interface Trainer extends User {
  price: number
  description: string
  moto: string
  photoUrl: string
}

export interface UpdateUserProps {
  id: string
  name: string
  surname: string
  phone?: string
  password?: string
}

export interface AdminUpdateUserProps {
  id: string
  name: string
  surname: string
  phone?: string
  role: string
  price?: number
  description?: string
  moto?: string
  photoUrl?: string
  balance: number
}
