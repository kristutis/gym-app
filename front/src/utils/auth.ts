import { useContext } from 'react'
import AuthContext from '../components/auth/AuthProvider'

export const useLoggedIn = (): boolean => {
  const { auth }: any = useContext(AuthContext)
  return !!Object.keys(auth).length
}

export const isAdmin = (): boolean => {
  return true
}
