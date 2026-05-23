import { useState, useEffect } from 'react'
import { useSupabaseClient } from '@renderer/contexts/SupabaseContext'

interface Record {
  id: string
  name: string
}

export function RecordsPage() {
  const supabase = useSupabaseClient()
  const [records, setRecords] = useState<Record[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    // ── 1. Initial fetch ────────────────────────────────────────────────────
    setLoading(true)
    setError(null)

    supabase
      .from('Test Data')       // ← your table name
      .select('*')
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) setError(error.message)
        else setRecords(data ?? [])
        setLoading(false)
      })

    // ── 2. Realtime channel ─────────────────────────────────────────────────
    // One channel handles all three event types — pick what you need.
    const channel = supabase
      .channel('records-live')   // channel name — unique per page/feature

      // ── Postgres Changes ─────────────────────────────────────────────────
      // Fires when rows are inserted/updated/deleted in your database.
      // Requires the table to have Realtime enabled in Supabase dashboard:
      // Database → Replication → supabase_realtime publication → your table
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'records' },
        (payload) => {
          if (cancelled) return
          setRecords((prev) => [payload.new as Record, ...prev])
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'records' },
        (payload) => {
          if (cancelled) return
          setRecords((prev) =>
            prev.map((r) => (r.id === payload.new.id ? (payload.new as Record) : r))
          )
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'records' },
        (payload) => {
          if (cancelled) return
          setRecords((prev) => prev.filter((r) => r.id !== payload.old.id))
        }
      )

      // ── Broadcast ────────────────────────────────────────────────────────
      // Client-to-client messages — no database involvement.
      // Useful for live cursors, notifications, presence pings, etc.
      // Any client subscribed to this channel and event receives the message.
      .on(
        'broadcast',
        { event: 'record-updated' },         // ← your custom event name
        (payload) => {
          if (cancelled) return
          console.log('[Broadcast] record-updated received:', payload)
          // payload.payload is whatever you passed in channel.send() below
        }
      )

      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('[Realtime] connected to records-live channel')
        }
        if (status === 'CHANNEL_ERROR') {
          console.error('[Realtime] channel error')
        }
      })

    // ── Cleanup ─────────────────────────────────────────────────────────────
    // Runs when org switches (supabase reference changes) or component unmounts.
    // Unsubscribes this org's channel before the new org's channel is created.
    return () => {
      cancelled = true
      supabase.removeChannel(channel)
    }
  }, [supabase])  // ← supabase changes on org switch → full cleanup + re-subscribe

  // ── Sending a broadcast from this client ───────────────────────────────────
  // Call this from a button handler or mutation callback.
  const broadcastUpdate = async (updatedRecord: Record) => {
    const channel = supabase.channel('records-live')
    await channel.send({
      type: 'broadcast',
      event: 'record-updated',
      payload: updatedRecord
    })
  }

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>
  if (error) return <p className="text-sm text-destructive">{error}</p>
console.log('Current records:', records[0])
  return (
    <div>
      {records.map((record) => (
        <div key={record.id as string}>
          {/* render your record */}
          record[0].Name
          {/* example update button */}
          <button onClick={() => broadcastUpdate(record)}>Broadcast Update</button>
        </div>
      ))}
    </div>
  )
}
