import * as React from 'react'

import { NavMain } from '@renderer/components/nav-main'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar
} from '@renderer/components/ui/sidebar'
import { OrganizationSwitcher} from '@clerk/react'
import { APP_ROUTES } from '@renderer/config'
import { useEffect, useMemo, useState } from 'react'

const SIDEBAR_ROUTES = APP_ROUTES.filter((route) => route.showInSidebar)

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div
          onClick={(e) => isCollapsed && e.stopPropagation()}
          style={{ pointerEvents: isCollapsed ? 'none' : 'auto' }}
        >
          <OrganizationSwitcher hidePersonal appearance={organizationAppearance} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={SIDEBAR_ROUTES} />
      </SidebarContent>
      <SidebarFooter/>
      <SidebarRail />
    </Sidebar>
  )
}
