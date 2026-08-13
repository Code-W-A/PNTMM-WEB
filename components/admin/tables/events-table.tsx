"use client"

import { CalendarDays, ExternalLink, Pencil, Users } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

import { DeleteEntityButton } from "@/components/admin/delete-entity-button"
import {
  AdminFilterSelect,
  AdminSearchInput,
  AdminToolbar,
} from "@/components/admin/ui/admin-toolbar"
import {
  AdminTableShell,
  CellMuted,
  CellTitle,
  RowActions,
} from "@/components/admin/ui/data-table"
import { EmptyState } from "@/components/admin/ui/empty-state"
import { RowActionLink } from "@/components/admin/ui/row-action-link"
import {
  ContentBadge,
  EventTimingBadge,
} from "@/components/admin/ui/status-badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDateTime } from "@/lib/datetime"
import type { EventDoc } from "@/types"

const STATUS_OPTIONS = [
  { value: "all", label: "Toate stările" },
  { value: "published", label: "Publicate" },
  { value: "draft", label: "Ciorne" },
]

const TIMING_OPTIONS = [
  { value: "all", label: "Toate datele" },
  { value: "upcoming", label: "Viitoare" },
  { value: "past", label: "Încheiate" },
]

function endsAt(event: EventDoc): number {
  const time = new Date(event.endDate ?? event.startDate).getTime()
  return Number.isNaN(time) ? 0 : time
}

export function EventsTable({ items }: { items: EventDoc[] }) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")
  const [timing, setTiming] = useState("all")

  const now = Date.now()

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return items.filter((item) => {
      if (status !== "all" && item.status !== status) return false

      if (timing !== "all") {
        const upcoming = endsAt(item) >= now
        if (timing === "upcoming" && !upcoming) return false
        if (timing === "past" && upcoming) return false
      }

      if (!needle) return true

      return [item.title, item.slug, item.location]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    })
  }, [items, query, status, timing, now])

  return (
    <>
      <AdminToolbar
        actions={
          <Button asChild>
            <Link href="/admin/evenimente/nou">Adaugă eveniment</Link>
          </Button>
        }
      >
        <AdminSearchInput
          value={query}
          onValueChange={setQuery}
          placeholder="Caută după titlu sau locație"
          label="Caută în evenimente"
        />
        <AdminFilterSelect
          value={status}
          onValueChange={setStatus}
          options={STATUS_OPTIONS}
          label="Filtrează după stare"
        />
        <AdminFilterSelect
          value={timing}
          onValueChange={setTiming}
          options={TIMING_OPTIONS}
          label="Filtrează după dată"
        />
      </AdminToolbar>

      {items.length === 0 ? (
        <AdminTableShell>
          <EmptyState
            icon={CalendarDays}
            title="Niciun eveniment adăugat"
            description="Evenimentele publicate apar în calendarul public al website-ului."
            action={
              <Button asChild>
                <Link href="/admin/evenimente/nou">Adaugă eveniment</Link>
              </Button>
            }
          />
        </AdminTableShell>
      ) : rows.length === 0 ? (
        <AdminTableShell>
          <EmptyState
            icon={CalendarDays}
            title="Niciun eveniment nu corespunde filtrelor"
            description="Modificați termenul căutat sau filtrele selectate."
          />
        </AdminTableShell>
      ) : (
        <AdminTableShell>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titlu</TableHead>
                <TableHead>Dată</TableHead>
                <TableHead>Locație</TableHead>
                <TableHead>Participanți</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-[18rem]">
                    <Link
                      href={`/admin/evenimente/${item.id}`}
                      className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <CellTitle>{item.title}</CellTitle>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <CellMuted>{formatDateTime(item.startDate)}</CellMuted>
                    <div className="mt-1">
                      <EventTimingBadge upcoming={endsAt(item) >= now} />
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[12rem]">
                    <CellMuted>{item.location}</CellMuted>
                  </TableCell>
                  <TableCell>
                    {item.registrationEnabled ? (
                      <Link
                        href={`/admin/evenimente/${item.id}/participanti`}
                        className="inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-primary outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Users className="h-3.5 w-3.5" aria-hidden="true" />
                        Vezi lista
                      </Link>
                    ) : (
                      <CellMuted>Înscrieri închise</CellMuted>
                    )}
                  </TableCell>
                  <TableCell>
                    <ContentBadge status={item.status} />
                  </TableCell>
                  <TableCell>
                    <RowActions>
                      <RowActionLink
                        href={`/admin/evenimente/${item.id}`}
                        label="Editează evenimentul"
                        icon={Pencil}
                      />
                      {item.status === "published" ? (
                        <RowActionLink
                          href={`/evenimente/${item.slug}`}
                          label="Vezi pe website"
                          icon={ExternalLink}
                          external
                        />
                      ) : null}
                      <DeleteEntityButton
                        endpoint={`/api/admin/events/${item.id}`}
                        title="Ștergi acest eveniment?"
                        successMessage="Evenimentul a fost șters."
                        iconOnly
                      />
                    </RowActions>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AdminTableShell>
      )}
    </>
  )
}
