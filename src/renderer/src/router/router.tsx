import { createHashRouter, Navigate } from 'react-router-dom'
import RootLayout from '@renderer/layouts/RootLayout'
import ProtectedLayout from '@renderer/layouts/ProtectedLayout'
import OrgLayout from '@renderer/layouts/OrgLayout'
import PublicLayout from '@renderer/layouts/PublicLayout'
import NotFound from '@renderer/pages/NotFound'
import SignInPage from '@renderer/pages/sign-in'
import SignUpPage from '@renderer/pages/sign-up'
import ChooseOrganizationPage from '@renderer/pages/choose-organization'
import { APP_ROUTES } from '@renderer/config'
import { buildRoutes } from '@renderer/router/built-routes'

export const router = createHashRouter([
  {
    element: <RootLayout />,
    children: [
      {
        // ── Protected tree (requires sign-in) ────────────────────────────────
        element: <ProtectedLayout />,
        children: [
          {
            // Org selection — accessible while signed in, before an org is active.
            // Must be a direct child of ProtectedLayout (not inside OrgLayout)
            // so it's reachable when no org is selected.
            path: '/org-select',
            element: <ChooseOrganizationPage />
          },
          {
            // OrgLayout checks for active org + initialises Supabase binding.
            // All sidebar/app routes live here.
            element: <OrgLayout />,
            children: [
              ...buildRoutes(APP_ROUTES),
              // Fallback: redirect unknown protected paths to dashboard
              { path: '*', element: <Navigate to="/" replace /> }
            ]
          }
        ]
      },
      {
        // ── Public tree (sign-in / sign-up) ───────────────────────────────────
        element: <PublicLayout />,
        children: [
          { path: '/sign-in/*', element: <SignInPage /> },
          { path: '/sign-up/*', element: <SignUpPage /> }
        ]
      },
      { path: '*', element: <NotFound /> }
    ]
  }
])
