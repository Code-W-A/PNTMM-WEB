"use client"

import { Users } from "lucide-react"
import { useMemo, useState } from "react"

import { ExportCsvLink } from "@/components/admin/export-csv-link"
import { UserStatusToggle } from "@/components/admin/user-status-toggle"
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
import { UserBadge } from "@/components/admin/ui/status-badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/datetime"
import type { AdminUserRow } from "@/services/admin/users-admin"

const STATUS_OPTIONS = [
  { value: "all", label: "Toate stările" },
  { value: "active", label: "Active" },
  { value: "disabled", label: "Dezactivate" },
]

export function UsersTable({ items }: { items: AdminUserRow[] }) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return items.filter((item) => {
      if (status !== "all" && item.status !== status) return false
      if (!needle) return true

      return [item.email ?? "", item.displayName ?? "", item.uid]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    })
  }, [items, query, status])

  return (
    <>
      <AdminToolbar actions={<ExportCsvLink dataset="utilizatori" />}>
        <AdminSearchInput
          value={query}
          onValueChange={setQuery}
          placeholder="Caută după nume sau email"
          label="Caută utilizatori"
        />
        <AdminFilterSelect
          value={status}
          onValueChange={setStatus}
          options={STATUS_OPTIONS}
          label="Filtrează după stare"
        />
      </AdminToolbar>

      {items.length === 0 ? (
        <AdminTableShell>
          <EmptyState
            icon={Users}
            title="Niciun cont înregistrat"
            description="Conturile create apar în această listă."
          />
        </AdminTableShell>
      ) : rows.length === 0 ? (
        <AdminTableShell>
          <EmptyState
            icon={Users}
            title="Niciun cont nu corespunde filtrelor"
            description="Modificați termenul căutat sau starea selectată."
          />
        </AdminTableShell>
      ) : (
        <AdminTableShell>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nume</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Data creării</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell className="max-w-[16rem]">
                    <CellTitle
                      secondary={user.isAdmin ? "Administrator" : undefined}
                    >
                      {user.displayName ?? "Fără nume"}
                    </CellTitle>
                  </TableCell>
                  <TableCell className="max-w-[18rem]">
                    <span className="block truncate text-sm text-foreground">
                      {user.email ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <CellMuted>{formatDate(user.createdAt)}</CellMuted>
                  </TableCell>
                  <TableCell>
                    <UserBadge status={user.status} />
                  </TableCell>
                  <TableCell>
                    <RowActions>
                      <UserStatusToggle
                        uid={user.uid}
                        email={user.email}
                        status={user.status}
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
