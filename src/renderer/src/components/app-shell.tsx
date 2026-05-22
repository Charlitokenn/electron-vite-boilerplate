import { AppSidebar } from '@renderer/components/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from './ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@renderer/components/ui/breadcrumb'
import { Separator } from '@renderer/components/ui/separator'
import { UserButton } from '@clerk/react'
import { Link, Outlet, useMatches } from 'react-router-dom'
import React from 'react'
import { RouteHandle } from '@renderer/router/router-types'
import { Home } from 'lucide-react'
import { ModeToggle } from '@renderer/components/mode-toggle'

/**
 * Breadcrumbs are derived from the `handle` property attached to each route
 * in build-routes.tsx — no manual label map to maintain here.
 *
 * useMatches() returns every matched route in the current tree, from root
 * down to the deepest matched segment. We filter to those with a handle.label
 * and render them as a crumb trail.
 */
const AppShell = (): React.ReactElement => {
  const matches = useMatches() as Array<{ id: string; pathname: string; handle: RouteHandle }>

  const crumbs = matches.filter((m) => m.handle?.label)

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center justify-between pr-5 border-b py-2">
            <div className="flex items-center gap-2 px-4 ">
              <SidebarTrigger className="-ml-1 bg-muted cursor-pointer" />
              <Separator
                orientation="vertical"
                className="mr-2 mt-1 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  {/* Home icon — always present, links back to / */}
                  <BreadcrumbItem>
                    <BreadcrumbLink>
                      <Link to="/" aria-label="Home">
                        <Home className="size-4" />
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>

                  {/* Dynamic crumbs — skips the root / match */}
                  {crumbs
                    .filter((crumb) => crumb.pathname !== '/')
                    .map((crumb, i, arr) => {
                      const isLast = i === arr.length - 1
                      return (
                        <React.Fragment key={crumb.id}>
                          <BreadcrumbSeparator />
                          <BreadcrumbItem>
                            {isLast ? (
                              <BreadcrumbPage>{crumb.handle.label}</BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink>
                                <Link to={crumb.pathname}>{crumb.handle.label}</Link>
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                        </React.Fragment>
                      )
                    })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="gap-0 flex items-center justify-center">
              <ModeToggle />
              <UserButton />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default AppShell
