import { ToastContextProvider } from '@renderer/components/reusable components/toast-context'
import { TooltipProvider } from '@renderer/components/ui/tooltip'
import { shadcn } from '@clerk/ui/themes'
import { ClerkProvider } from '@clerk/react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AppConfig } from '@renderer/config'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'
import { ThemeProvider } from '@renderer/components/theme-provider'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk publishable key')
}

export default function RootLayout() {
  const navigate = useNavigate()

  //Set app title on mount
  useEffect(() => {
    document.title = AppConfig.app.name
  }, [])

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      appearance={{
        theme: shadcn,
      }}
    >
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <NuqsAdapter>
          <ToastContextProvider>
            <TooltipProvider>
              <Outlet />
            </TooltipProvider>
          </ToastContextProvider>
        </NuqsAdapter>
      </ThemeProvider>
    </ClerkProvider>
  )
}
