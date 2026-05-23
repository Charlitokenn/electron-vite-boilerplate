import { JSX } from 'react'
import PageHero from '@renderer/components/ui/pageHero'
import { useUser } from '@clerk/react'
import { getPersonalizedGreeting } from '@renderer/lib/utils'

export const Dashboard = (): JSX.Element => {
  const { user } = useUser()
  const greeting = getPersonalizedGreeting(user?.firstName)
  
  return (
    <section className="py-2">
      <PageHero type={'greeting'} title={greeting} />
    </section>
  )
}

export default Dashboard
