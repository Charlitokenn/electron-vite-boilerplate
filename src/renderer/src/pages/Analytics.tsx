import { JSX } from 'react'
import { useRouteHandle } from '@renderer/router/hooks/useRouteHandle'
import PageHero from '@renderer/components/ui/pageHero'

export const Analytics = (): JSX.Element => {
  const { label } = useRouteHandle()

  return (
    <section className="py-2">
      <PageHero type={'hero'} title={label} subtitle={'View your analytics and insights'} />
    </section>
  )
}

export default Analytics
