"use client"

import { Users } from "lucide-react"
import { useMemo, useState } from "react"

import { ExportCsvLink } from "@/components/admin/export-csv-link"
import {
  AdminSearchInput,
  AdminToolbar,
  ResultCount,
} from "@/components/admin/ui/admin-toolbar"
import {
  AdminTableShell,
  CellMuted,
} from "@/components/admin/ui/data-table"
import { EmptyState } from "@/components/admin/ui/empty-state"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDateTime } from "@/lib/datetime"
import type { EventRegistrationDoc } from "@/types"

export function RegistrationsTable({
  items,
  eventId,
}: {
  items: EventRegistrationDoc[]
  eventId: string
}) {
  const [query, setQuery] = useState("")

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return items

    return items.filter((item) =>
      [item.name, item.email, item.phone ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(needle),
    )
  }, [items, query])

  if (items.length === 0) {
    return (
      <AdminTableShell>
        <EmptyState
          icon={Users}
          title="Nicio înscriere"
          description="Înscrierile făcute din pagina publică a evenimentului apar aici."
        />
      </AdminTableShell>
    )
  }

  return (
    <>
      <AdminToolbar
        actions={<ExportCsvLink dataset="participanti" eventId={eventId} />}
      >
        <AdminSearchInput
          value={query}
          onValueChange={setQuery}
          placeholder="Caută după nume, email sau telefon"
          label="Caută în participanți"
        />
        <ResultCount
          filtered={rows.length}
          total={items.length}
          noun="înscrieri"
        />
      </AdminToolbar>

      {rows.length === 0 ? (
        <AdminTableShell>
          <EmptyState
            icon={Users}
            title="Niciun participant nu corespunde căutării"
            description="Modificați termenul căutat."
          />
        </AdminTableShell>
      ) : (
        <AdminTableShell>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nume</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefon</TableHead>
                <TableHead>Înscris la</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>
                    <a
                      href={`mailto:${item.email}`}
                      className="break-all text-sm text-primary underline-offset-4 hover:underline"
                    >
                      {item.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    <CellMuted>{item.phone ?? "—"}</CellMuted>
                  </TableCell>
                  <TableCell>
                    <CellMuted>{formatDateTime(item.createdAt)}</CellMuted>
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
