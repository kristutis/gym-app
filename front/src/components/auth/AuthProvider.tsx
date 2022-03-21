import { createContext, useEffect, useState } from 'react'
import { AuthorisationInfo } from '../../utils/auth'

const AUTH_KEY = 'AUTH_KEY'

const AuthContext = createContext({})

export const AuthProvider = ({ children }: any) => {
  const currentUser = JSON.parse(localStorage.getItem(AUTH_KEY) || '{}')
  const [auth, setAuth] = useState(currentUser as AuthorisationInfo)

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
  }, [auth])

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
