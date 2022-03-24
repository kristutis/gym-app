import { createContext, useEffect, useState } from 'react'
import { refreshUserCall } from '../../utils/apicalls/login'
import { AuthorisationInfo } from '../../utils/auth'

const AUTH_KEY = 'AUTH_KEY'

const AuthContext = createContext({})

export const AuthProvider = ({ children }: any) => {
  const currentUser = JSON.parse(
    localStorage.getItem(AUTH_KEY) || '{}'
  ) as AuthorisationInfo

  const [auth, setAuth] = useState(currentUser)

  useEffect(() => {
    if (Object.keys(auth).length === 0) {
      return
    }
    refreshUserCall(auth.refreshToken)
      .then((a) => setAuth(a as AuthorisationInfo))
      .catch((err) => alert(err))
  }, [])

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
