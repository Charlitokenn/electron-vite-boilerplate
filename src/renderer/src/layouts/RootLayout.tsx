import { ThemeProvider } from 'next-themes'
import { ToastContextProvider } from '@renderer/components/reusable components/toast-context'
import { TooltipProvider } from '@renderer/components/ui/tooltip'

import { ClerkProvider } from '@clerk/react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { AppConfig } from '@renderer/config'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'

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
    >
      {/*<ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">*/}
      <ThemeProvider
        attribute="class"
        storageKey="vite-ui-theme"
        defaultTheme="light"
        disableTransitionOnChange
      >
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
