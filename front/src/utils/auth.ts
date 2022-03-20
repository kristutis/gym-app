import { useContext } from 'react'
import AuthContext from '../components/auth/AuthProvider'

export const useAuthHeader = (): string => {
  const { auth }: any = useContext(AuthContext) as AuthorisationInfo
  return auth.tokenType + ' ' + auth.accessToken
}

export const useLoggedIn = (): boolean => {
  const { auth }: any = useContext(AuthContext)
  return !!Object.keys(auth).length
}

export const useUserRole = (): boolean => {
  return true
}

export const useAdminRole = (): boolean => {
  return true
}

export interface AuthorisationInfo {
  tokenType: string
  expireDate: string
  accessToken: string
  refreshToken: string
}
