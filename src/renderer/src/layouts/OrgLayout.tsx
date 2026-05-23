// src/renderer/src/layouts/OrgLayout.tsx
//
// Sits between ProtectedLayout (auth guard) and AppShell (UI shell).
// Responsibilities:
//   1. Redirect to /org-select if no active organization
//   2. Provide SupabaseProvider so all child routes have a client
//   3. Gate rendering until the Supabase client is ready
//   4. Show a retry screen on credential fetch failure

import { useOrganization } from '@clerk/react'
import { Navigate } from 'react-router-dom'
import { SupabaseProvider, useSupabase } from '@renderer/contexts/SupabaseContext'
import AppShell from '@renderer/components/app-shell'
import { ROUTES } from '@renderer/config'

// ── Inner gate (consumes SupabaseContext set up by the outer wrapper) ─────────

function OrgGate() {
  const { organization } = useOrganization()
  const { status, error, retry } = useSupabase()

  // No active org → send to selection
  if (!organization) {
    return <Navigate to={ROUTES.orgSelect} replace />
  }

  // Fetching credentials after sign-in or org switch
  if (status === 'idle' || status === 'loading') {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Connecting to workspace…</p>
        </div>
      </div>
    )
  }

  // Credential fetch failed
  if (status === 'error') {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <p className="text-sm font-medium text-destructive">
          {error?.message ?? 'Failed to connect to workspace'}
        </p>
        <p className="text-xs text-muted-foreground">
          This organization may not be provisioned yet. Contact your administrator.
        </p>
        <button
          onClick={retry}
          className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    )
  }

  // status === 'ready' — client is live, render the full app shell
  return <AppShell />
}

// ── Exported layout ───────────────────────────────────────────────────────────
// SupabaseProvider wraps OrgGate so the gate can consume SupabaseContext.

export default function OrgLayout() {
  return (
    <SupabaseProvider>
      <OrgGate />
    </SupabaseProvider>
  )
}
