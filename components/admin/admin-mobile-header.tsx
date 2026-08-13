"use client"

import { usePathname } from "next/navigation"

import { currentSectionLabel } from "@/components/admin/nav-items"
import { SidebarTrigger } from "@/components/ui/sidebar"

/**
 * Bara de sus cu butonul de colapsare: pe mobil deschide drawer-ul, pe desktop
 * comută între sidebar complet și doar iconuri.
 */
export function AdminMobileHeader() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:px-4">
      <SidebarTrigger
        className="h-9 w-9 text-muted-foreground hover:bg-secondary hover:text-foreground"
        aria-label="Comută navigarea"
      />
      <p className="min-w-0 truncate font-heading text-sm font-bold lg:hidden">
        {currentSectionLabel(pathname)}
      </p>
    </header>
  )
}
