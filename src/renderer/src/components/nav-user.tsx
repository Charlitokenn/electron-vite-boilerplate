import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,

  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@renderer/components/ui/sidebar"
import { BadgeCheckIcon, CreditCardIcon, BellIcon, LogOutIcon } from "lucide-react"
import { SignOutButton, UserButton } from '@clerk/react'

export function NavUser({
  user
}: {
  user: {
    fullName: string | null | undefined
    firstName: string | null | undefined
    email: string | undefined
    avatar: string | undefined
    orgName: string | undefined
    orgLogo: string | undefined
  }
}) {
  const { isMobile } = useSidebar()
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />
            }
          >
            <UserButton />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.fullName}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            {/*<ChevronsUpDownIcon className="ml-auto size-4" />*/}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheckIcon />
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <LogOutIcon />
              <SignOutButton>
                <span className="cursor-pointer">Log out</span>
              </SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
