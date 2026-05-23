// Drop this into your AppShell header / sidebar header.
// The status dot reflects the Supabase binding state during org switches.

import { OrganizationSwitcher, useOrganization } from '@clerk/react'
import { useSupabase } from '@renderer/contexts/SupabaseContext'
import { ROUTES } from '@renderer/config'
import { useEffect, useMemo, useState } from 'react'
import { useSidebar } from '@renderer/components/ui/sidebar'

export function AppOrgSwitcher() {
  const { organization } = useOrganization()
  const { status } = useSupabase()

  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'
  const [showText, setShowText] = useState(state === 'expanded')

  const organizationAppearance = useMemo(
    () => ({
      elements: {
        organizationSwitcherTrigger: {
          justifyContent: isCollapsed ? 'center' : 'flex-start',
          padding: isCollapsed ? '0' : undefined,
          width: isCollapsed ? '100%' : undefined
        },
        organizationPreview: {
          justifyContent: isCollapsed ? 'center' : 'flex-start'
        },
        organizationPreviewAvatarContainer: {
          width: isCollapsed ? '1.75rem' : '2.3rem',
          height: isCollapsed ? '1.75rem' : '2.3rem',
          overflow: 'hidden',
          flexShrink: 0
        },
        avatarBox: {
          width: isCollapsed ? '1.75rem' : '2.3rem',
          height: isCollapsed ? '1.75rem' : '2.3rem',
          overflow: 'hidden'
        },
        organizationPreviewAvatarImage: {
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        },
        organizationPreviewTextContainer: {
          display: showText ? 'flex' : 'none'
        },
        organizationPreviewMainIdentifier: {
          fontSize: '0.875rem',
          fontWeight: '700',
          whiteSpace: 'normal',
          wordBreak: 'break-word',
          lineHeight: '1.25'
        },
        organizationSwitcherTriggerIcon: 'hidden'
      }
    }),
    [isCollapsed, showText]
  )

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    if (state === 'expanded') {
      // wait for sidebar animation to finish before showing text
      timer = setTimeout(() => setShowText(true), 200)
    } else {
      // defer to next tick instead of calling synchronously
      timer = setTimeout(() => setShowText(false), 0)
    }

    return () => clearTimeout(timer)
  }, [state])

  return (
    <div className="flex items-center gap-2">
      <OrganizationSwitcher
        hidePersonal
        afterSelectOrganizationUrl={ROUTES.dashboard}
        afterLeaveOrganizationUrl={ROUTES.orgSelect}
        afterCreateOrganizationUrl={ROUTES.dashboard}
        appearance={organizationAppearance}
      />

      {/*
        Status dot — visible feedback while credentials are re-fetched
        after an org switch. Disappears once binding is ready.
      */}
      {status === 'loading' && (
        <span
          className="h-2 w-2 animate-pulse rounded-full bg-amber-400"
          title="Connecting to workspace…"
        />
      )}
      {status === 'ready' && (
        <span
          className="h-2 w-2 rounded-full bg-emerald-400"
          title={`Connected: ${organization?.name}`}
        />
      )}
      {status === 'error' && (
        <span
          className="h-2 w-2 rounded-full bg-destructive"
          title="Connection error — check settings"
        />
      )}
    </div>
  )
}
