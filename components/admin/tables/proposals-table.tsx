"use client"

import { Lightbulb } from "lucide-react"
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
import type { ProposalDoc } from "@/types"

const STATUS_OPTIONS = [
  { value: "all", label: "Toate stările" },
  { value: "new", label: "Nou" },
  { value: "in_progress", label: "În lucru" },
  { value: "closed", label: "Închis" },
]

export function ProposalsTable({ items }: { items: ProposalDoc[] }) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return items.filter((item) => {
      if (status !== "all" && item.status !== status) return false
      if (!needle) return true

      return [item.title, item.name, item.email]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    })
  }, [items, query, status])

  return (
    <>
      <AdminToolbar actions={<ExportCsvLink dataset="propuneri" />}>
        <AdminSearchInput
          value={query}
          onValueChange={setQuery}
          placeholder="Caută după titlu, nume sau email"
          label="Caută în propuneri"
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
            icon={Lightbulb}
            title="Nicio propunere primită"
            description="Propunerile trimise din website apar aici."
          />
        </AdminTableShell>
      ) : rows.length === 0 ? (
        <AdminTableShell>
          <EmptyState
            icon={Lightbulb}
            title="Nicio propunere nu corespunde filtrelor"
            description="Modificați termenul căutat sau statusul selectat."
          />
        </AdminTableShell>
      ) : (
        <AdminTableShell>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titlu</TableHead>
                <TableHead>Persoană</TableHead>
                <TableHead>Dată</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-[22rem]">
                    <Link
                      href={`/admin/propuneri/${item.id}`}
                      className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <CellTitle>{item.title}</CellTitle>
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[14rem]">
                    <CellTitle secondary={item.email}>{item.name}</CellTitle>
                  </TableCell>
                  <TableCell>
                    <CellMuted>{formatDateTime(item.createdAt)}</CellMuted>
                  </TableCell>
                  <TableCell>
                    <WorkflowBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/propuneri/${item.id}`}>Deschide</Link>
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
