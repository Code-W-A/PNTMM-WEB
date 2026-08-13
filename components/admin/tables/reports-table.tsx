"use client"

import { ImageIcon, Inbox } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

import { ExportCsvLink } from "@/components/admin/export-csv-link"
import {
  AdminFilterSelect,
  AdminSearchInput,
  AdminToolbar,
} from "@/components/admin/ui/admin-toolbar"
import {
  AdminTableShell,
  CellMuted,
  CellTitle,
} from "@/components/admin/ui/data-table"
import { EmptyState } from "@/components/admin/ui/empty-state"
import { WorkflowBadge } from "@/components/admin/ui/status-badge"
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
import type { ReportDoc } from "@/types"

const STATUS_OPTIONS = [
  { value: "all", label: "Toate stările" },
  { value: "new", label: "Nou" },
  { value: "in_progress", label: "În lucru" },
  { value: "closed", label: "Închis" },
]

export function ReportsTable({ items }: { items: ReportDoc[] }) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return items.filter((item) => {
      if (status !== "all" && item.status !== status) return false
      if (!needle) return true

      return [item.subject, item.name, item.email]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    })
  }, [items, query, status])

  return (
    <>
      <AdminToolbar actions={<ExportCsvLink dataset="sesizari" />}>
        <AdminSearchInput
          value={query}
          onValueChange={setQuery}
          placeholder="Caută după subiect, nume sau email"
          label="Caută în sesizări"
        />
        <AdminFilterSelect
          value={status}
          onValueChange={setStatus}
          options={STATUS_OPTIONS}
          label="Filtrează după status"
        />
      </AdminToolbar>

      {items.length === 0 ? (
        <AdminTableShell>
          <EmptyState
            icon={Inbox}
            title="Nicio sesizare primită"
            description="Sesizările trimise din website apar aici."
          />
        </AdminTableShell>
      ) : rows.length === 0 ? (
        <AdminTableShell>
          <EmptyState
            icon={Inbox}
            title="Nicio sesizare nu corespunde filtrelor"
            description="Modificați termenul căutat sau statusul selectat."
          />
        </AdminTableShell>
      ) : (
        <AdminTableShell>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subiect</TableHead>
                <TableHead>Persoană</TableHead>
                <TableHead>Dată</TableHead>
                <TableHead>Foto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-[20rem]">
                    <Link
                      href={`/admin/sesizari/${item.id}`}
                      className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <CellTitle>{item.subject}</CellTitle>
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[14rem]">
                    <CellTitle secondary={item.email}>{item.name}</CellTitle>
                  </TableCell>
                  <TableCell>
                    <CellMuted>{formatDateTime(item.createdAt)}</CellMuted>
                  </TableCell>
                  <TableCell>
                    {item.photoPath ? (
                      <span
                        className="inline-flex items-center gap-1.5 text-sm text-foreground"
                        title="Sesizarea are o fotografie atașată"
                      >
                        <ImageIcon
                          className="h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                        Da
                      </span>
                    ) : (
                      <CellMuted>Nu</CellMuted>
                    )}
                  </TableCell>
                  <TableCell>
                    <WorkflowBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/sesizari/${item.id}`}>Deschide</Link>
                    </Button>
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
