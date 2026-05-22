import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { ModeToggle } from '@/components/mode-toggle'
import React from 'react'
import { SIDEBAR_DATA, APP_DETAILS } from '@/lib/constants'
import { HeartIcon } from 'lucide-react'
import { Outlet, useLocation } from 'react-router'

function Sidebar(): React.JSX.Element {
  const location = useLocation()

  const currentNav =
    SIDEBAR_DATA.find((item) => item.url === location.pathname) ||
    SIDEBAR_DATA.find((item) => item.url === '/home')

  const currentTitle = currentNav?.title || 'Settings'

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset id="main-content" className="overflow-hidden">
        <header className="flex justify-between mr-2 h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1 cursor-pointer bg-sidebar-accent text-gray-400" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">{APP_DETAILS.name}</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{currentTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <ModeToggle />
        </header>
        <main className="flex-1 overflow-auto p-4">
          <Outlet />
        </main>
        <footer className="px-4 flex text-xs text-primary items-center justify-between h-6 shrink-0">
          <span className="flex items-center gap-1">
            Made with <HeartIcon className="size-4 text-red-500 animate-pulse" /> by{' '}
            {APP_DETAILS.developer}
          </span>
          <span>
            {APP_DETAILS.name} v{APP_DETAILS.version}
          </span>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  )
}
export default Sidebar
