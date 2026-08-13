import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Card de secțiune folosit în panou și în paginile de detaliu.
 */
export function SectionCard({
  title,
  description,
  action,
  children,
  className,
  bodyClassName,
}: {
  title?: string
  description?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  bodyClassName?: string
}) {
  return (
    <section className={cn("rounded-xl border bg-background", className)}>
      {title ? (
        <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
          <div className="min-w-0">
            <h2 className="font-heading text-base font-bold text-foreground">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}

      <div className={cn(bodyClassName ?? "p-5")}>{children}</div>
    </section>
  )
}

/** Listă de tip etichetă/valoare, pentru datele expeditorului. */
export function DetailList({
  items,
}: {
  items: { label: string; value: ReactNode }[]
}) {
  return (
    <dl className="divide-y">
      {items.map(({ label, value }) => (
        <div key={label} className="grid gap-1 py-3 first:pt-0 last:pb-0">
          <dt className="text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            {label}
          </dt>
          <dd className="break-words text-sm text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
