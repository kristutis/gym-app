import { createContext, useEffect, useState } from 'react'

const AUTH_KEY = 'AUTH_KEY'

const AuthContext = createContext({})

export const AuthProvider = ({ children }: any) => {
  const currentUser = JSON.parse(localStorage.getItem(AUTH_KEY) || '{}')
  const [auth, setAuth] = useState(currentUser)

  useEffect(() => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
  }, [auth])

  console.log(auth)

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
