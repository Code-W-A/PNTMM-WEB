import {
  Bell,
  CalendarDays,
  Inbox,
  LayoutDashboard,
  Lightbulb,
  Mails,
  Newspaper,
  Users,
  type LucideIcon,
} from "lucide-react"

export interface AdminNavItem {
  href: string
  label: string
  icon: LucideIcon
  /** Potrivire exactă, pentru rădăcina panoului. */
  exact?: boolean
}

export interface AdminNavGroup {
  label: string
  items: AdminNavItem[]
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "General",
    items: [
      {
        href: "/admin",
        label: "Panou",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    label: "Conținut",
    items: [
      { href: "/admin/stiri", label: "Știri", icon: Newspaper },
      { href: "/admin/evenimente", label: "Evenimente", icon: CalendarDays },
    ],
  },
  {
    label: "Interacțiuni",
    items: [
      { href: "/admin/sesizari", label: "Sesizări", icon: Inbox },
      { href: "/admin/propuneri", label: "Propuneri", icon: Lightbulb },
      { href: "/admin/formulare", label: "Formulare website", icon: Mails },
      { href: "/admin/notificari", label: "Notificări", icon: Bell },
    ],
  },
  {
    label: "Utilizatori",
    items: [{ href: "/admin/utilizatori", label: "Utilizatori", icon: Users }],
  },
]

export function isNavItemActive(item: AdminNavItem, pathname: string): boolean {
  return item.exact ? pathname === item.href : pathname.startsWith(item.href)
}

/** Titlul secțiunii curente, folosit în bara mobilă. */
export function currentSectionLabel(pathname: string): string {
  const match = ADMIN_NAV.flatMap((group) => group.items)
    .filter((item) => isNavItemActive(item, pathname))
    .sort((a, b) => b.href.length - a.href.length)[0]

  return match?.label ?? "Administrare"
}
