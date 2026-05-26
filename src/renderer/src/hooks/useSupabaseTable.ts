// Two hooks that cover the vast majority of page data needs:
//
//   useSupabaseQuery  — fetch rows with optional filters, no realtime
//   useSupabaseTable  — fetch + live Postgres Changes (insert/update/delete)
//
// Both automatically re-run when the org switches (supabase reference changes).
// Both accept a generic type so TypeScript knows the shape of your rows.

import { useEffect, useRef, useState, useCallback } from 'react'
import { useSupabaseClient } from '@renderer/contexts/SupabaseContext'
import type { SupabaseClient } from '@supabase/supabase-js'

// ── Types ─────────────────────────────────────────────────────────────────────

interface QueryState<T> {
  data: T[]
  loading: boolean
  error: string | null
  refetch: () => void
}

interface TableState<T> extends QueryState<T> {}

type FilterFn<T> = (
  query: ReturnType<SupabaseClient['from']>
) => ReturnType<SupabaseClient['from']>

// ── useSupabaseQuery ──────────────────────────────────────────────────────────
// Fetches rows from a table once (no realtime).
// Use this for reference data, dropdowns, reports — anything that doesn't
// need live updates.
//
// Usage:
//   const { data, loading, error, refetch } = useSupabaseQuery<Property>(
//     'properties',
//     (q) => q.eq('status', 'active').order('created_at', { ascending: false })
//   )

export function useSupabaseQuery<T extends Record<string, unknown>>(
  table: string,
  // Optional filter/order/limit chain — receives the query builder, return it
  filter?: FilterFn<T>,
  // Extra dependencies that should re-trigger the fetch (e.g. a filter value
  // from component state). The supabase client is always a dependency.
  deps: unknown[] = []
): QueryState<T> {
  const supabase = useSupabaseClient()
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    const base = supabase.from(table).select('*')
    const query = filter ? filter(base as ReturnType<SupabaseClient['from']>) : base

    ;(query as ReturnType<typeof supabase.from>).then(
      ({ data: rows, error: err }: { data: T[] | null; error: { message: string } | null }) => {
        if (cancelled) return
        if (err) setError(err.message)
        else setData(rows ?? [])
        setLoading(false)
      }
    )

    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, table, tick, ...deps])

  return { data, loading, error, refetch }
}

// ── useSupabaseTable ──────────────────────────────────────────────────────────
// Fetches rows AND subscribes to live Postgres Changes (insert/update/delete).
// Use this for main data tables that need to stay in sync across users.
//
// Requires Realtime enabled for the table in Supabase Dashboard:
//   Database → Replication → supabase_realtime publication → toggle your table
//
// Usage:
//   const { data, loading, error } = useSupabaseTable<Tenant>(
//     'tenants',
//     'id',                                                  ← primary key column
//     (q) => q.order('created_at', { ascending: false })     ← optional filter
//   )

export function useSupabaseTable<T extends Record<string, unknown>>(
  table: string,
  primaryKey: keyof T = 'id' as keyof T,
  filter?: FilterFn<T>
): TableState<T> {
  const supabase = useSupabaseClient()
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => setTick((t) => t + 1), [])

  // Stable ref to data so realtime handlers don't close over stale state
  const dataRef = useRef<T[]>([])
  dataRef.current = data

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    // ── Initial fetch ─────────────────────────────────────────────────────
    const base = supabase.from(table).select('*')
    const query = filter ? filter(base as ReturnType<SupabaseClient['from']>) : base

    ;(query as ReturnType<typeof supabase.from>).then(
      ({ data: rows, error: err }: { data: T[] | null; error: { message: string } | null }) => {
        if (cancelled) return
        if (err) setError(err.message)
        else setData(rows ?? [])
        setLoading(false)
      }
    )

    // ── Realtime subscription ─────────────────────────────────────────────
    const channel = supabase
      .channel(`${table}-realtime-${Date.now()}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table },
        ({ new: row }) => {
          if (cancelled) return
          setData((prev) => [row as T, ...prev])
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table },
        ({ new: row }) => {
          if (cancelled) return
          setData((prev) =>
            prev.map((r) => (r[primaryKey] === (row as T)[primaryKey] ? (row as T) : r))
          )
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table },
        ({ old: row }) => {
          if (cancelled) return
          setData((prev) => prev.filter((r) => r[primaryKey] !== (row as Partial<T>)[primaryKey]))
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.error(`[Supabase] Realtime error on ${table}`)
        }
      })

    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, table, tick])

  return { data, loading, error, refetch }
}
