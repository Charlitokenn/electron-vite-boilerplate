import { LayoutDashboard, Settings, Bell, CreditCard, User, ChartBar } from 'lucide-react'

export const AppConfig = {
  app: {
    name: 'Electron Starter',
    description: 'A boilerplate for building desktop apps with Vite, React, and Electron.',
    version: '1.0.0',
    author: 'Your Name',
  },
}

// ─── Path constants ────────────────────────────────────────────────────────────
// Use these everywhere instead of raw strings to avoid typos.

export const ROUTES = {
  dashboard:              '/',
  analytics:              '/analytics',
  settings:               '/settings',
  settingsGeneral:        '/settings/general',
  settingsProfile:        '/settings/profile',
  settingsNotifications:  '/settings/notifications',
  settingsBilling:        '/settings/billing',
} as const

// ─── Route config ──────────────────────────────────────────────────────────────
// This is the SINGLE place to add, remove, or reorder routes.
// The router, sidebar, and breadcrumbs are all derived from this array.
//
// Rules:
//  • `path`    — absolute path for top-level routes, relative segment for children
//  • `element` — lazy or eager component. On a parent with children, this becomes
//                the index route (rendered when the parent path is matched exactly).
//                If omitted on a parent, the first child is shown at the index.
//  • `showInSidebar` — controls NavMain visibility
//  • `roles`   — coarse access control; checked in ProtectedLayout if needed

import Dashboard          from '@renderer/pages/Dashboard'
import Analytics          from '@renderer/pages/Analytics'
import SettingsGeneral    from '@renderer/pages/settings/General'
import SettingsProfile    from '@renderer/pages/settings/Profile'
import SettingsNotifications from '@renderer/pages/settings/Notifications'
import SettingsBilling    from '@renderer/pages/settings/Billing'
import { AppRoute } from '@renderer/router/router-types'

export const APP_ROUTES: AppRoute[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: ROUTES.dashboard,
    icon: LayoutDashboard,
    element: Dashboard,
    showInSidebar: true,
    roles: ['admin', 'user']
  },
  {
    id: 'analytics',
    label: 'Analytics',
    path: ROUTES.analytics,
    icon: ChartBar,
    element: Analytics,
    showInSidebar: true,
    roles: ['admin', 'user'],
    children: [
      {
        id: 'settings-notifications',
        path: 'notifications',
        label: 'Notifications',
        icon: Bell,
        element: SettingsNotifications
      }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    path: ROUTES.settings,
    icon: Settings,
    showInSidebar: true,
    roles: ['admin', 'user'],
    // No top-level element → router redirects to first child (general)
    children: [
      {
        id: 'settings-general',
        path: 'general',
        label: 'General',
        icon: Settings,
        element: SettingsGeneral
      },
      {
        id: 'settings-profile',
        path: 'profile',
        label: 'Profile',
        icon: User,
        element: SettingsProfile
      },
      {
        id: 'settings-billing',
        path: 'billing',
        label: 'Billing',
        icon: CreditCard,
        element: SettingsBilling
      }
    ]
  }
]
