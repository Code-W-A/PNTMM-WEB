"use client"

import { ExternalLink } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { LogoutButton } from "@/components/admin/logout-button"
import { ADMIN_NAV, isNavItemActive } from "@/components/admin/nav-items"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"

/**
 * `--sidebar-accent` este galben în tema publică, iar shadcn îl folosește
 * pentru hover, apăsare și item activ. Suprascriu toate cele trei stări explicit
 * pe buton: hover neutru, item activ navy cu indicator galben. Suprascrierea se
 * face prin clase, nu prin variabile, pentru că pe mobil sidebar-ul se randează
 * într-un portal, în afara wrapper-ului panoului.
 */
const MENU_BUTTON_CLASS = [
  "relative h-9 gap-3 px-3 font-medium",
  "hover:bg-primary/[0.07] hover:text-foreground",
  "active:bg-primary/[0.07] active:text-foreground",
  "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground",
  "data-[active=true]:hover:bg-primary data-[active=true]:hover:text-primary-foreground",
  "data-[active=true]:before:absolute data-[active=true]:before:left-0 data-[active=true]:before:top-1/2",
  "data-[active=true]:before:h-4 data-[active=true]:before:w-[3px] data-[active=true]:before:-translate-y-1/2",
  "data-[active=true]:before:rounded-r-full data-[active=true]:before:bg-accent",
  "group-data-[collapsible=icon]:!size-9 group-data-[collapsible=icon]:!p-2",
].join(" ")

export function AdminSidebar({
  email,
  name,
}: {
  email?: string
  name?: string
}) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile, state } = useSidebar()
  const collapsed = state === "collapsed" && !isMobile

  function closeOnMobile() {
    if (isMobile) setOpenMobile(false)
  }

  const displayName = name?.trim() || email || "Administrator"
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border p-3 group-data-[collapsible=icon]:p-2">
        <Link
          href="/admin"
          onClick={closeOnMobile}
          className={cn(
            "flex items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
            "group-data-[collapsible=icon]:justify-center",
          )}
        >
          <Image
            src={siteConfig.logo}
            alt=""
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-md object-contain"
          />
          <span className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block truncate font-heading text-sm font-bold leading-tight text-sidebar-foreground">
              {siteConfig.name}
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Panou de administrare
            </span>
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-2 py-3 group-data-[collapsible=icon]:px-1">
        {ADMIN_NAV.map((group) => (
          <SidebarGroup key={group.label} className="py-1.5">
            <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active = isNavItemActive(item, pathname)

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.label}
                        className={MENU_BUTTON_CLASS}
                      >
                        <Link
                          href={item.href}
                          onClick={closeOnMobile}
                          aria-current={active ? "page" : undefined}
                        >
                          <item.icon aria-hidden="true" />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="gap-1 border-t border-sidebar-border p-3 group-data-[collapsible=icon]:p-2">
        <div
          className={cn(
            "flex items-center gap-3 px-1 py-2",
            "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
          )}
        >
          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-primary-foreground"
          >
            {initial}
          </span>
          <span className="min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="block truncate text-sm font-semibold leading-tight text-sidebar-foreground">
              {displayName}
            </span>
            <span className="block truncate text-xs text-muted-foreground">
              {name && email ? email : "Administrator"}
            </span>
          </span>
        </div>

        {collapsed ? (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/"
                  aria-label="Vezi website-ul"
                  className="flex size-9 items-center justify-center rounded-md text-muted-foreground outline-none transition-colors hover:bg-primary/[0.07] hover:text-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Vezi website-ul</TooltipContent>
            </Tooltip>
            <LogoutButton iconOnly />
          </>
        ) : (
          <>
            <Link
              href="/"
              onClick={closeOnMobile}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-primary/[0.07] hover:text-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring"
            >
              <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" />
              Vezi website-ul
            </Link>
            <LogoutButton />
          </>
        )}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
