// src/renderer/src/layouts/ProtectedLayout.tsx
//
// Sole responsibility: verify the user is signed in.
// Org check and Supabase binding are handled by OrgLayout (one level down).
// Keeping these separate means /org-select is reachable while signed in
// but before an org is selected.

import { useAuth } from '@clerk/react'
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedLayout() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) return null

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />
  }

  // Render whichever child route matched:
  //   /org-select  → ChooseOrganizationPage (no org required)
  //   /*           → OrgLayout (org + Supabase required)
  return <Outlet />
}
