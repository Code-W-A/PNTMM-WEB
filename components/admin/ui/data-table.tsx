import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Carcasa tuturor tabelelor din administrare. Stilul antetului și al rândurilor
 * este definit aici o singură dată, prin selectori descendenți, ca paginile să
 * folosească direct componentele de tabel fără să repete clase.
 */
export function AdminTableShell({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-background",
        "[&_thead]:bg-muted/40",
        "[&_th]:h-10 [&_th]:whitespace-nowrap [&_th]:px-4 [&_th]:text-xs [&_th]:font-semibold [&_th]:uppercase [&_th]:tracking-[0.06em] [&_th]:text-muted-foreground",
        "[&_td]:px-4 [&_td]:py-3.5 [&_td]:align-middle",
        "[&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-muted/35",
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Celulă principală de rând: titlul pe care se dă click. */
export function CellTitle({
  children,
  secondary,
}: {
  children: ReactNode
  secondary?: ReactNode
}) {
  return (
    <div className="min-w-0">
      <span className="block truncate font-medium text-foreground">
        {children}
      </span>
      {secondary ? (
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
          {secondary}
        </span>
      ) : null}
    </div>
  )
}

/** Valoare secundară, cu tratare uniformă a lipsei de date. */
export function CellMuted({ children }: { children: ReactNode }) {
  return (
    <span className="whitespace-nowrap text-sm text-muted-foreground">
      {children}
    </span>
  )
}

/** Container pentru acțiunile de la capătul rândului. */
export function RowActions({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-end gap-1">{children}</div>
  )
}

/** Rezumat compact sub header: „Publicate: 4 · Ciorne: 1”. */
export function AdminSummary({
  items,
}: {
  items: { label: string; value: number }[]
}) {
  return (
    <dl className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
      {items.map(({ label, value }) => (
        <div key={label} className="flex items-baseline gap-1.5">
          <dt className="text-muted-foreground">{label}:</dt>
          <dd className="font-semibold tabular-nums text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
