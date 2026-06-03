// ─────────────────────────────────────────────────────────────────────────────
// Example pages — showing how clean each page becomes with the hooks
// ─────────────────────────────────────────────────────────────────────────────

// ── 1. Live table (insert/update/delete updates automatically) ────────────────

import { useSupabaseTable, useSupabaseQuery } from '@renderer/hooks/useSupabaseTable'

interface Property {
  id: string
  name: string
  status: string
  created_at: string
}

// Every insert/update/delete from any client updates this list in real time.
// Zero boilerplate — no useEffect, no channel setup, no cleanup.
export function PropertiesPage() {
  const { data: properties, loading, error } = useSupabaseTable<Property>(
    'properties',             // table name
    'id',                     // primary key
    (query) => query.order('created_at', { ascending: false })
  )

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>
  if (error)   return <p className="text-sm text-destructive">{error}</p>

  return (
    <ul>
      {properties.map((p) => (
        <li key={p.id}>{p.name} — {p.status}</li>
      ))}
    </ul>
  )
}

// ── 2. Static fetch with filters (no realtime needed) ─────────────────────────

interface Tenant {
  id: string
  name: string
  clerk_org_id: string
}

// Fetches once. Refetch manually when needed (e.g. after a form submit).
export function TenantsPage() {
  const { data: tenants, loading, error, refetch } = useSupabaseQuery<Tenant>(
    'tenants',
    (q) => q.eq('active', true).order('name')
  )

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>
  if (error)   return <p className="text-sm text-destructive">{error}</p>

  return (
    <div>
      <button onClick={refetch}>Refresh</button>
      <ul>
        {tenants.map((t) => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul>
    </div>
  )
}

// ── 3. Filter driven by component state ───────────────────────────────────────

import { useState } from 'react'

interface Payment {
  id: string
  amount: number
  status: string
  phone: string
}

// Re-fetches automatically when `status` filter changes.
// Pass the filter value in the deps array so the hook knows to re-run.
export function PaymentsPage() {
  const [status, setStatus] = useState('all')

  const { data: payments, loading, error } = useSupabaseQuery<Payment>(
    'payments',
    (q) => status === 'all' ? q.order('created_at', { ascending: false })
      : q.eq('status', status).order('created_at', { ascending: false }),
    [status]   // ← re-fetches when status changes
  )

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>
  if (error)   return <p className="text-sm text-destructive">{error}</p>

  return (
    <div>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="all">All</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="failed">Failed</option>
      </select>

      <ul>
        {payments.map((p) => (
          <li key={p.id}>TZS {p.amount} — {p.status} — {p.phone}</li>
        ))}
      </ul>
    </div>
  )
}

// ── 4. Multiple tables on one page ────────────────────────────────────────────

interface Unit {
  id: string
  property_id: string
  unit_number: string
}

interface Lease {
  id: string
  unit_id: string
  tenant_name: string
  expires_at: string
}

// Each hook manages its own fetch, state, and realtime channel independently.
export function DashboardPage() {
  const { data: properties } = useSupabaseTable<Property>('properties', 'id')
  const { data: units }      = useSupabaseTable<Unit>('units', 'id')
  const { data: leases }     = useSupabaseQuery<Lease>(
    'leases',
    (q) => q.gt('expires_at', new Date().toISOString())
  )

  return (
    <div>
      <p>{properties.length} properties</p>
      <p>{units.length} units</p>
      <p>{leases.length} active leases</p>
    </div>
  )
}
