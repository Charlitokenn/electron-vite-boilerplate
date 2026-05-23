import { JSX } from 'react'
import PageHero from '@renderer/components/ui/pageHero'
import { useRouteHandle } from '@renderer/router/hooks/useRouteHandle'
import { RecordsPage } from '@renderer/pages/settings/columns'

export const Billing = (): JSX.Element => {
  const { label } = useRouteHandle()

  return (
    <section className="py-2">
      <PageHero type={'hero'} title={label} subtitle={'Manage your billing information'} />
      <RecordsPage/>
    </section>
  )
}

export default Billing
