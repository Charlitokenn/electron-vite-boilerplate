import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

// Lazy-load page components for code splitting
const Playground = lazy(() => import('@renderer/pages/Playground'))
const Models = lazy(() => import('@renderer/pages/Models'))
const Documentation = lazy(() => import('@renderer/pages/Settings'))
const Settings = lazy(() => import('@renderer/pages/Settings'))
const NotFound = lazy(() => import('@renderer/pages/NotFound'))
const SignIn = lazy(() => import('@renderer/components/sign-in'))

export const routes: RouteObject[] = [
  {
    path: 'sign-in',
    element: <SignIn />,
  },
  {
    path: 'app',
    lazy: async () => {
      const { default: AppShell } = await import('@renderer/components/app-shell')
      return { Component: AppShell }
    },
    children: [
      {
        index: true,
        element: <Playground />,
      },
      {
        path: 'playground',
        element: <Playground />,
      },
      {
        path: 'models',
        element: <Models />,
      },
      {
        path: 'documentation',
        element: <Documentation />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]

