import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

/**
 * Singurul header folosit de paginile de administrare: titlu și descriere la
 * stânga, acțiuni la dreapta.
 */
export function AdminPageHeader({
  title,
  description,
  actions,
  backHref,
  backLabel = "Înapoi",
  eyebrow,
  meta,
}: {
  title: string
  description?: string
  actions?: ReactNode
  backHref?: string
  backLabel?: string
  eyebrow?: string
  meta?: ReactNode
}) {
  return (
    <header className="mb-6 border-b pb-5">
      {backHref ? (
        <Link
          href={backHref}
          className="mb-3 inline-flex items-center gap-1 rounded-md text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          {backLabel}
        </Link>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4">
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="truncate font-heading text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {description ? (
            <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
          {meta ? <div className="mt-3">{meta}</div> : null}
        </div>

        {actions ? (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </header>
  )
}
