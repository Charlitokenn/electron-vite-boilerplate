import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { useAuth, useClerk, useOrganization } from '@clerk/react'
import { fetchOrgCredentials, OrgCredentials, WorkerError } from '@renderer/lib/workerClient'

// ── Types ─────────────────────────────────────────────────────────────────────

type BindingStatus =
  | 'idle'     // No org active
  | 'loading'  // Fetching credentials / creating client
  | 'ready'    // Client initialized and ready
  | 'error'    // Credential fetch or client creation failed

interface SupabaseState {
  client: SupabaseClient | null
  credentials: OrgCredentials | null
  status: BindingStatus
  error: WorkerError | Error | null
}

interface SupabaseContextValue extends SupabaseState {
  /** Manually retry after status === 'error' */
  retry: () => void
}

// ── Context ───────────────────────────────────────────────────────────────────

const SupabaseContext = createContext<SupabaseContextValue | null>(null)

// ── Provider ──────────────────────────────────────────────────────────────────

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isSignedIn } = useAuth()
  const { organization } = useOrganization()

  // Stable primitive — prevents effect from re-running on Clerk object identity changes
  const orgId = organization?.id ?? null

  const [state, setState] = useState<SupabaseState>({
    client: null,
    credentials: null,
    status: 'idle',
    error: null
  })

  const { setActive } = useClerk()

  // Track which org the current client belongs to
  const boundOrgIdRef = useRef<string | null>(null)
  // Hold client ref for cleanup without state dependency
  const clientRef = useRef<SupabaseClient | null>(null)
  // Cancel in-flight requests when org changes mid-fetch
  const abortControllerRef = useRef<AbortController | null>(null)

  // ── Teardown ──────────────────────────────────────────────────────────────
  const teardownClient = useCallback(async () => {
    if (!clientRef.current) return
    await clientRef.current.removeAllChannels()
    clientRef.current.auth.stopAutoRefresh()
    clientRef.current = null
  }, [])

  // ── Initialize / re-initialize ────────────────────────────────────────────
  const initializeBinding = useCallback(async () => {

    const sess = await getToken({ skipCache: true })
    const payload = sess ? JSON.parse(atob(sess.split('.')[1])) : null
    console.log('[DEBUG] JWT payload:', payload)
    console.log('[DEBUG] org_id in token:', payload?.o.id)
    console.log('[DEBUG] orgId from hook:', orgId)


    if (!isSignedIn || !orgId) {
      await teardownClient()
      boundOrgIdRef.current = null
      setState({ client: null, credentials: null, status: 'idle', error: null })
      return
    }

    if (boundOrgIdRef.current === orgId) return

    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    setState((prev) => ({ ...prev, status: 'loading', error: null }))

    try {
      // Ensure org_id is embedded in the JWT for this session
      await setActive({ organization: orgId })
      if (controller.signal.aborted) return

      const token = await getToken({ skipCache: true })
      if (!token) throw new Error('Failed to retrieve session token')
      if (controller.signal.aborted) return

      const credentials = await fetchOrgCredentials(token, orgId)
      if (controller.signal.aborted) return

      await teardownClient()

      const newClient = createClient(credentials.supabaseUrl, credentials.supabaseAnonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      })

      clientRef.current = newClient
      boundOrgIdRef.current = orgId

      setState({ client: newClient, credentials, status: 'ready', error: null })
    } catch (err) {
      if (controller.signal.aborted) return
      const error = err instanceof Error ? err : new Error('Unknown error')
      console.error('[SupabaseContext] Binding failed:', error)
      setState((prev) => ({ ...prev, status: 'error', error }))
    }
  }, [isSignedIn, orgId, getToken, setActive, teardownClient])

  // Run on mount and whenever isSignedIn or orgId changes (covers org switching)
  useEffect(() => {
    initializeBinding()
  }, [initializeBinding])

  // Full cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
      teardownClient()
    }
  }, [teardownClient])

  return (
    <SupabaseContext.Provider value={{ ...state, retry: initializeBinding }}>
      {children}
    </SupabaseContext.Provider>
  )
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useSupabase() {
  const ctx = useContext(SupabaseContext)
  if (!ctx) throw new Error('useSupabase must be used within <SupabaseProvider>')
  return ctx
}

/**
 * Returns the Supabase client directly.
 * Only use this inside routes wrapped by OrgLayout — it throws if the client
 * is not ready, but OrgLayout ensures it always is before rendering children.
 */
export function useSupabaseClient(): SupabaseClient {
  const { client, status } = useSupabase()
  if (status !== 'ready' || !client) {
    throw new Error('Supabase client not ready. Only call this inside OrgLayout children.')
  }
  return client
}
