import { useContext } from 'react'
import AuthContext from '../components/auth/AuthProvider'

export const useAuthHeader = (): string => {
  const { auth } = useContext(AuthContext) as { auth: AuthorisationInfo }
  return auth.tokenType + ' ' + auth.accessToken
}

export const useLoggedIn = (): boolean => {
  const { auth } = useContext(AuthContext) as { auth: AuthorisationInfo }
  return !!Object.keys(auth).length
}

export const useUserRole = (): boolean => {
  const { auth } = useContext(AuthContext) as { auth: AuthorisationInfo }
  return auth.role == UserRole.user
}

export const useAdminRole = (): boolean => {
  const { auth } = useContext(AuthContext) as { auth: AuthorisationInfo }
  return auth.role == UserRole.admin
}

export interface AuthorisationInfo {
  tokenType: string
  expireDate: string
  accessToken: string
  refreshToken: string
  role: UserRole
}

export enum UserRole {
  user = 'user',
  admin = 'admin',
}
