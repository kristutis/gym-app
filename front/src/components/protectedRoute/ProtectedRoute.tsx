import React from 'react'
import { Route } from 'react-router-dom'
import { useLoggedIn } from '../../utils/auth'
import Unauthorized from '../unauthorized/Unauthorized'

export default function ProtectedRoute({
  index,
  path,
  component,
}: ProtectedRouteProps) {
  return useLoggedIn() ? (
    <Route key={index} exact path={path} component={component} />
  ) : (
    <Unauthorized />
  )
}

export interface ProtectedRouteProps {
  index: number
  path: string
  component: any
}
