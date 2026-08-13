"use client"

import { FileText, Mail, Trash2 } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"

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
import type {
  ContactMessageDoc,
  DeletionRequestDoc,
  InterestSubmissionDoc,
} from "@/types"

const WORKFLOW_OPTIONS = [
  { value: "all", label: "Toate stările" },
  { value: "new", label: "Nou" },
  { value: "in_progress", label: "În lucru" },
  { value: "closed", label: "Închis" },
]

/** Extractoarele sunt definite la nivel de modul ca să rămână stabile. */
function useSearch<T>(items: T[], fields: (item: T) => string[]) {
  const [query, setQuery] = useState("")

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return items

    return items.filter((item) =>
      fields(item).join(" ").toLowerCase().includes(needle),
    )
  }, [items, query, fields])

  return { query, setQuery, rows }
}

const contactFields = (item: ContactMessageDoc) => [
  item.subject,
  item.name,
  item.email,
]

const interestFields = (item: InterestSubmissionDoc) => [
  item.firstName,
  item.lastName,
  item.email,
  item.locality ?? "",
]

const deletionFields = (item: DeletionRequestDoc) => [
  item.email,
  item.message ?? "",
]

export function ContactMessagesTable({
  items,
}: {
  items: ContactMessageDoc[]
}) {
  const { query, setQuery, rows } = useSearch(items, contactFields)

  if (items.length === 0) {
    return (
      <AdminTableShell>
        <EmptyState
          icon={Mail}
          title="Niciun mesaj de contact"
          description="Mesajele trimise din pagina de contact apar aici."
        />
      </AdminTableShell>
    )
  }

  return (
    <>
      <AdminToolbar>
        <AdminSearchInput
          value={query}
          onValueChange={setQuery}
          placeholder="Caută după subiect, nume sau email"
          label="Caută în mesajele de contact"
        />
      </AdminToolbar>

      {rows.length === 0 ? (
        <AdminTableShell>
          <EmptyState
            icon={Mail}
            title="Niciun mesaj nu corespunde căutării"
            description="Modificați termenul căutat."
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
                <TableHead className="text-right">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-[22rem]">
                    <Link
                      href={`/admin/formulare/contact/${item.id}`}
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
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/formulare/contact/${item.id}`}>
                        Deschide
                      </Link>
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

export function InterestSubmissionsTable({
  items,
}: {
  items: InterestSubmissionDoc[]
}) {
  const { query, setQuery, rows } = useSearch(items, interestFields)

  if (items.length === 0) {
    return (
      <AdminTableShell>
        <EmptyState
          icon={FileText}
          title="Niciun formular de interes"
          description="Cererile trimise din pagina Implică-te apar aici."
        />
      </AdminTableShell>
    )
  }

  return (
    <>
      <AdminToolbar>
        <AdminSearchInput
          value={query}
          onValueChange={setQuery}
          placeholder="Caută după nume, email sau localitate"
          label="Caută în formularele de interes"
        />
      </AdminToolbar>

      {rows.length === 0 ? (
        <AdminTableShell>
          <EmptyState
            icon={FileText}
            title="Nicio cerere nu corespunde căutării"
            description="Modificați termenul căutat."
          />
        </AdminTableShell>
      ) : (
        <AdminTableShell>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Persoană</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Localitate</TableHead>
                <TableHead>Dată</TableHead>
                <TableHead className="text-right">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-[16rem]">
                    <Link
                      href={`/admin/formulare/interes/${item.id}`}
                      className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <CellTitle>
                        {item.firstName} {item.lastName}
                      </CellTitle>
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[16rem]">
                    <CellTitle secondary={item.phone ?? undefined}>
                      {item.email}
                    </CellTitle>
                  </TableCell>
                  <TableCell>
                    <CellMuted>{item.locality ?? "—"}</CellMuted>
                  </TableCell>
                  <TableCell>
                    <CellMuted>{formatDateTime(item.createdAt)}</CellMuted>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/formulare/interes/${item.id}`}>
                        Deschide
                      </Link>
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

export function DeletionRequestsTable({
  items,
}: {
  items: DeletionRequestDoc[]
}) {
  const [status, setStatus] = useState("all")
  const { query, setQuery, rows } = useSearch(items, deletionFields)

  const filtered = useMemo(
    () => rows.filter((item) => status === "all" || item.status === status),
    [rows, status],
  )

  if (items.length === 0) {
    return (
      <AdminTableShell>
        <EmptyState
          icon={Trash2}
          title="Nicio cerere de ștergere"
          description="Cererile de ștergere a datelor apar aici."
        />
      </AdminTableShell>
    )
  }

  return (
    <>
      <AdminToolbar>
        <AdminSearchInput
          value={query}
          onValueChange={setQuery}
          placeholder="Caută după email"
          label="Caută în cererile de ștergere"
        />
        <AdminFilterSelect
          value={status}
          onValueChange={setStatus}
          options={WORKFLOW_OPTIONS}
          label="Filtrează după status"
        />
      </AdminToolbar>

      {filtered.length === 0 ? (
        <AdminTableShell>
          <EmptyState
            icon={Trash2}
            title="Nicio cerere nu corespunde filtrelor"
            description="Modificați termenul căutat sau statusul selectat."
          />
        </AdminTableShell>
      ) : (
        <AdminTableShell>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Dată</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-[22rem]">
                    <Link
                      href={`/admin/formulare/stergere/${item.id}`}
                      className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <CellTitle>{item.email}</CellTitle>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <CellMuted>{formatDateTime(item.createdAt)}</CellMuted>
                  </TableCell>
                  <TableCell>
                    <WorkflowBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/admin/formulare/stergere/${item.id}`}>
                        Deschide
                      </Link>
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
