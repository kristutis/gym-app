import { useContext } from 'react'
import AuthContext from '../components/auth/AuthProvider'

export interface AuthorisationInfo {
  tokenType: string
  expireDate: string
  accessToken: string
  refreshToken: string
  role: UserRole
  id: string
}

export enum UserRole {
  user = 'user',
  trainer = 'trainer',
  admin = 'admin',
}

export const useUserId = (): string => {
  const { auth } = useContext(AuthContext) as { auth: AuthorisationInfo }
  return useLoggedIn() ? auth.id : ''
}

export const useAuthHeader = (): string => {
  const { auth } = useContext(AuthContext) as { auth: AuthorisationInfo }
  return useLoggedIn() ? auth.tokenType + ' ' + auth.accessToken : ''
}

export const useLoggedIn = (): boolean => {
  const { auth } = useContext(AuthContext) as { auth: AuthorisationInfo }
  return !!Object.keys(auth).length
}

export const useUserRole = (): boolean => {
  const { auth } = useContext(AuthContext) as { auth: AuthorisationInfo }
  return auth.role === UserRole.user
}

export const useAdminRole = (): boolean => {
  const { auth } = useContext(AuthContext) as { auth: AuthorisationInfo }
  return auth.role === UserRole.admin
}

export const useTrainerRole = (): boolean => {
  const { auth } = useContext(AuthContext) as { auth: AuthorisationInfo }
  return auth.role === UserRole.trainer
}
