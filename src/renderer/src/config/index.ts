export const AppConfig = {
  app: {
    name: 'Electron Starter',
    description: 'A boilerplate for building desktop apps with Vite, React, and Electron.',
    version: '1.0.0',
    author: 'Charles Nkonoki'
  }
}

// ─── Path constants ────────────────────────────────────────────────────────────

export const ROUTES = {
  // ── New ────────────────────────────────────────────────────────────────────
  orgSelect: '/org-select', // ← added

  // ── Existing (unchanged) ──────────────────────────────────────────────────
  dashboard: '/',
  analytics: '/analytics',
  settings: '/settings',
  settingsGeneral: '/settings/general',
  settingsProfile: '/settings/profile',
  settingsNotifications: '/settings/notifications',
  settingsBilling: '/settings/billing'
} as const

// ─── Route config ──────────────────────────────────────────────────────────────
// APP_ROUTES is unchanged — org-select is NOT a sidebar route so it does not
// belong here. It is registered directly in router.tsx.

import Dashboard from '@renderer/pages/Dashboard'
import Analytics from '@renderer/pages/Analytics'
import SettingsGeneral from '@renderer/pages/settings/General'
import SettingsProfile from '@renderer/pages/settings/Profile'
import SettingsNotifications from '@renderer/pages/settings/Notifications'
import SettingsBilling from '@renderer/pages/settings/Billing'
import { LayoutDashboard, Settings, Bell, CreditCard, User, ChartBar } from 'lucide-react'
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
