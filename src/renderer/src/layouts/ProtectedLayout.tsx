import { useAuth } from '@clerk/react'
import { Navigate } from 'react-router-dom'
import AppShell from '@renderer/components/app-shell'

export default function ProtectedLayout() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return null // or a loading spinner

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />
  }

  return <AppShell/>
}
