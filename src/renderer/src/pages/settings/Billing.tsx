import { JSX } from 'react'
import PageHero from '@renderer/components/ui/pageHero'
import { useRouteHandle } from '@renderer/router/hooks/useRouteHandle'
import { useSupabaseTable } from '@renderer/hooks/useSupabaseTable'

interface Tenant {
  id: string
  name: string
  created_at: string
}

export const Billing = (): JSX.Element => {
  const { label } = useRouteHandle()

  const {
    data: testData,
    loading,
    error
  } = useSupabaseTable<Tenant>(
    'Test Data', // table name
    'id', // primary key
    (query) => query.select('*').order('created_at', { ascending: false })
  )

  if (loading) return <p className="text-sm text-muted-foreground">Loading...</p>
  if (error) return <p className="text-sm text-destructive">{error}</p>



  return (
    <section className="py-2">
      <PageHero type={'hero'} title={label} subtitle={'Manage your billing information'} />
      <ul>
        {testData.map((p) => (
          <li key={p.id}>
            {p.name} — {p.created_at}
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Billing;
