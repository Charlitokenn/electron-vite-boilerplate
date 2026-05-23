import { JSX, useEffect } from 'react'
import { OrganizationList, useOrganization } from '@clerk/react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@renderer/config'

const ChooseOrganizationPage = (): JSX.Element => {
  const { organization } = useOrganization()
  const navigate = useNavigate()

  // If the user already has an active org (returning session), skip selection
  useEffect(() => {
    if (organization) {
      navigate(ROUTES.dashboard, { replace: true })
    }
  }, [organization, navigate])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Select a Workspace</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose the organization you want to work in
          </p>
        </div>
        <OrganizationList
          hidePersonal // Orgs only — no personal accounts
          afterSelectOrganizationUrl={ROUTES.dashboard} // Navigate after selection
          afterCreateOrganizationUrl={ROUTES.dashboard} // Navigate after creating a new org
        />
      </div>
    </div>
  )
}

export default ChooseOrganizationPage
