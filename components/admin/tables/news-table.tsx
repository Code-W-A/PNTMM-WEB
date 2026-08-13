"use client"

import { ExternalLink, Newspaper, Pencil } from "lucide-react"
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
import { ContentBadge } from "@/components/admin/ui/status-badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate, formatDateTime } from "@/lib/datetime"
import type { NewsDoc } from "@/types"

const STATUS_OPTIONS = [
  { value: "all", label: "Toate stările" },
  { value: "published", label: "Publicate" },
  { value: "draft", label: "Ciorne" },
]

export function NewsTable({ items }: { items: NewsDoc[] }) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("all")

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return items.filter((item) => {
      if (status !== "all" && item.status !== status) return false
      if (!needle) return true

      return [item.title, item.slug, item.category]
        .join(" ")
        .toLowerCase()
        .includes(needle)
    })
  }, [items, query, status])

  return (
    <>
      <AdminToolbar
        actions={
          <Button asChild>
            <Link href="/admin/stiri/nou">Adaugă știre</Link>
          </Button>
        }
      >
        <AdminSearchInput
          value={query}
          onValueChange={setQuery}
          placeholder="Caută după titlu sau categorie"
          label="Caută în știri"
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
            icon={Newspaper}
            title="Nicio știre adăugată"
            description="Prima știre publicată apare imediat pe website."
            action={
              <Button asChild>
                <Link href="/admin/stiri/nou">Adaugă știre</Link>
              </Button>
            }
          />
        </AdminTableShell>
      ) : rows.length === 0 ? (
        <AdminTableShell>
          <EmptyState
            icon={Newspaper}
            title="Nicio știre nu corespunde filtrelor"
            description="Modificați termenul căutat sau starea selectată."
          />
        </AdminTableShell>
      ) : (
        <AdminTableShell>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titlu</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Publicare</TableHead>
                <TableHead>Ultima modificare</TableHead>
                <TableHead className="text-right">Acțiuni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="max-w-[22rem]">
                    <Link
                      href={`/admin/stiri/${item.id}`}
                      className="block rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <CellTitle secondary={item.category}>
                        {item.title}
                      </CellTitle>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <ContentBadge status={item.status} />
                  </TableCell>
                  <TableCell>
                    <CellMuted>{formatDate(item.publishedAt)}</CellMuted>
                  </TableCell>
                  <TableCell>
                    <CellMuted>{formatDateTime(item.updatedAt)}</CellMuted>
                  </TableCell>
                  <TableCell>
                    <RowActions>
                      <RowActionLink
                        href={`/admin/stiri/${item.id}`}
                        label="Editează știrea"
                        icon={Pencil}
                      />
                      {item.status === "published" ? (
                        <RowActionLink
                          href={`/stiri/${item.slug}`}
                          label="Vezi pe website"
                          icon={ExternalLink}
                          external
                        />
                      ) : null}
                      <DeleteEntityButton
                        endpoint={`/api/admin/news/${item.id}`}
                        title="Ștergi această știre?"
                        successMessage="Știrea a fost ștearsă."
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
