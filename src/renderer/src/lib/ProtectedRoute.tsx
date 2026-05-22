import { JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/react'

interface ProtectedRouteProps {
  children: JSX.Element
}

const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  if (!isSignedIn) {
    return <Navigate to="#/sign-in" replace />
  }

  return children
}

export default ProtectedRoute

