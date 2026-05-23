import { useAuth } from '@clerk/react'
import { Outlet, Navigate } from 'react-router-dom'
import { Spinner } from '@renderer/components/spinner'

export default function PublicLayout() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return <section className={'flex items-center justify-center h-screen'}><Spinner /></section>

  if (isSignedIn) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
