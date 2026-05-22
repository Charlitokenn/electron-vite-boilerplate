import { createHashRouter } from 'react-router-dom'
import RootLayout from '@renderer/layouts/RootLayout'
import ProtectedLayout from '@renderer/layouts/ProtectedLayout'
import PublicLayout from '@renderer/layouts/PublicLayout'
import NotFound from '@renderer/pages/NotFound'
import SignInPage from '@renderer/pages/sign-in'
import SignUpPage from '@renderer/pages/sign-up'
import { APP_ROUTES } from '@renderer/config'
import { buildRoutes } from '@renderer/router/built-routes'

export const router = createHashRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <ProtectedLayout />,
        children: buildRoutes(APP_ROUTES) // ← entire protected tree from config
      },
      {
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
