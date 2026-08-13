import {
  ArrowRight,
  Bell,
  CalendarDays,
  CalendarPlus,
  CheckCircle2,
  FilePlus2,
  Inbox,
  Lightbulb,
  Newspaper,
} from "lucide-react"
import Link from "next/link"

import { AdminPageHeader } from "@/components/admin/ui/page-header"
import { EmptyState } from "@/components/admin/ui/empty-state"
import { SectionCard } from "@/components/admin/ui/section-card"
import { StatCard } from "@/components/admin/ui/stat-card"
import { ContentBadge } from "@/components/admin/ui/status-badge"
import { formatDate, formatDateTime } from "@/lib/datetime"
import { getDashboardData } from "@/services/admin/dashboard"

export const dynamic = "force-dynamic"

const QUICK_ACTIONS = [
  { href: "/admin/stiri/nou", label: "Adaugă știre", icon: FilePlus2 },
  { href: "/admin/evenimente/nou", label: "Adaugă eveniment", icon: CalendarPlus },
  { href: "/admin/sesizari", label: "Vezi sesizările", icon: Inbox },
  { href: "/admin/notificari", label: "Trimite notificare", icon: Bell },
]

export default async function AdminDashboardPage() {
  const { kpis, attention, upcomingEvents, recentNews } =
    await getDashboardData()

  return (
    <>
      <AdminPageHeader
        title="Panou de administrare"
        description="Situația curentă a conținutului publicat și a mesajelor primite."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Știri publicate"
          value={kpis.publishedNews}
          icon={Newspaper}
          href="/admin/stiri"
          linkLabel="Vezi știrile"
        />
        <StatCard
          label="Evenimente viitoare"
          value={kpis.upcomingEvents}
          icon={CalendarDays}
          href="/admin/evenimente"
          linkLabel="Vezi evenimentele"
        />
        <StatCard
          label="Sesizări noi"
          value={kpis.newReports}
          icon={Inbox}
          href="/admin/sesizari"
          linkLabel="Vezi sesizările"
          emphasis
        />
        <StatCard
          label="Propuneri noi"
          value={kpis.newProposals}
          icon={Lightbulb}
          href="/admin/propuneri"
          linkLabel="Vezi propunerile"
          emphasis
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <SectionCard
          title="Necesită atenție"
          description="Cele mai recente solicitări nerezolvate."
          className="xl:col-span-2"
          bodyClassName="p-0"
        >
          {attention.length === 0 ? (
            <EmptyState
              icon={CheckCircle2}
              title="Nimic în așteptare"
              description="Toate sesizările și mesajele primite au fost preluate."
            />
          ) : (
            <ul className="divide-y">
              {attention.map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-4 px-5 py-3.5 outline-none transition-colors hover:bg-muted/40 focus-visible:bg-muted/40"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
                        {item.kindLabel}
                      </span>
                      <span className="mt-0.5 block truncate text-sm font-medium text-foreground">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {item.person} · {formatDateTime(item.createdAt)}
                      </span>
                    </span>
                    <ArrowRight
                      className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Acțiuni rapide" bodyClassName="p-3">
          <ul className="space-y-1">
            {QUICK_ACTIONS.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <SectionCard
          title="Evenimente viitoare"
          action={
            <Link
              href="/admin/evenimente"
              className="rounded-md text-sm font-semibold text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
            >
              Toate
            </Link>
          }
          bodyClassName="p-0"
        >
          {upcomingEvents.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="Niciun eveniment programat"
              description="Adăugați un eveniment pentru a-l afișa pe website."
            />
          ) : (
            <ul className="divide-y">
              {upcomingEvents.map((event) => (
                <li key={event.id}>
                  <Link
                    href={`/admin/evenimente/${event.id}`}
                    className="flex items-center gap-4 px-5 py-3.5 outline-none transition-colors hover:bg-muted/40 focus-visible:bg-muted/40"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {event.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {formatDateTime(event.startDate)} · {event.location}
                      </span>
                    </span>
                    <ContentBadge status={event.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard
          title="Conținut recent"
          action={
            <Link
              href="/admin/stiri"
              className="rounded-md text-sm font-semibold text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
            >
              Toate
            </Link>
          }
          bodyClassName="p-0"
        >
          {recentNews.length === 0 ? (
            <EmptyState
              icon={Newspaper}
              title="Nicio știre adăugată"
              description="Prima știre publicată apare imediat pe website."
            />
          ) : (
            <ul className="divide-y">
              {recentNews.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/admin/stiri/${item.id}`}
                    className="flex items-center gap-4 px-5 py-3.5 outline-none transition-colors hover:bg-muted/40 focus-visible:bg-muted/40"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                        {formatDate(item.publishedAt)} · {item.category}
                      </span>
                    </span>
                    <ContentBadge status={item.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </>
  )
}
