/**
 * ─────────────────────────────────────────────────
 *  APP CONFIG  ← EDIT THIS FILE FOR EACH NEW PROJECT
 *
 *  This is the single file you need to customise
 *  when spinning up a new app from this template:
 *    1. Update APP_CONFIG (name, description)
 *    2. Update TEAMS with your team/workspace names
 *    3. Replace NAV_SECTIONS with your app's navigation
 *    4. Optionally add NAV_PROJECTS entries
 * ─────────────────────────────────────────────────
 */

import {
  type LucideIcon,
  LayoutDashboard,
  MessageCircleDashed,
  PartyPopper,
  LucideBarChart,
  WalletIcon
} from 'lucide-react'
import { ComponentType } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

export interface NavItem {
  title: string
  url: string
  component: ComponentType
}

export interface NavSection {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  items?: NavItem[]
}

export interface TeamConfig {
  name: string
  logo: LucideIcon
  plan: string
}

export interface ProjectConfig {
  name: string
  url: string
  icon: LucideIcon
}

// ── App metadata ────────────────────────────────────────────────────────────

export const APP_CONFIG = {
  /** Shown in sidebar header, auth page logo, and window title */
  name: 'Mchango App',
  description: 'Event Bulk sms app',
  version: '1.0.0',
  developer: 'Charles Nkonoki'
} as const

// ── Teams / workspaces ───────────────────────────────────────────────────────

export const TEAMS: TeamConfig[] = [{ name: 'My Workspace', logo: LayoutDashboard, plan: '124' }]

// ── Main navigation ──────────────────────────────────────────────────────────

export const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Settings',
    url: '/home',
    icon: LayoutDashboard,
    isActive: true,
    viewType: 'dashboard',
    items: []
  },
  {
    title: 'Events',
    url: '/events',
    icon: PartyPopper,
    viewType: 'other',
    items: []
  },
  {
    title: 'Messages',
    url: '/messages',
    icon: MessageCircleDashed,
    viewType: 'other',
    items: []
  },
  {
    title: 'Reports',
    url: '/reports',
    icon: LucideBarChart,
    viewType: 'other',
    items: []
  },
  {
    title: 'Purchase SMS',
    url: '/credits',
    icon: WalletIcon,
    viewType: 'other',
    items: []
  }
]

// ── Projects (optional sidebar section) ─────────────────────────────────────

export const NAV_PROJECTS: ProjectConfig[] = [
  // { name: 'My Project', url: '/projects/my-project', icon: Frame },
]

export const SIDEBAR_MENU_ITEMS = {
  ADMIN_MENU: NAV_SECTIONS,
  TENANTS_MENU: NAV_SECTIONS
}
