import { JSX } from 'react'
import { useRouteHandle } from '@renderer/router/hooks/useRouteHandle'
import PageHero from '@renderer/components/ui/pageHero'

export const Profile = (): JSX.Element => {
  const { label } = useRouteHandle()

  return (
    <section className="py-2">
      <PageHero type={'hero'} title={label} subtitle={'Manage your profile information'} />
    </section>
  )
}

export default Profile
