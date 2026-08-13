import Link from "next/link"

import { cn } from "@/lib/utils"

export interface LinkTabItem {
  href: string
  label: string
  active: boolean
  count?: number
}

/**
 * Taburi implementate ca linkuri, ca navigarea între secțiuni să rămână pe
 * rute distincte și randarea să se facă în continuare pe server.
 */
export function LinkTabs({ items }: { items: LinkTabItem[] }) {
  return (
    <nav className="mb-6 border-b">
      <ul className="-mb-px flex gap-1 overflow-x-auto">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={item.active ? "page" : undefined}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                item.active
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {item.label}
              {typeof item.count === "number" ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums",
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {item.count}
                </span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
