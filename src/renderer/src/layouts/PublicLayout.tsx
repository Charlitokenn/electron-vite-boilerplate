import { useAuth } from '@clerk/react'
import { Outlet, Navigate } from 'react-router-dom'

export default function PublicLayout() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return null

  if (isSignedIn) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
