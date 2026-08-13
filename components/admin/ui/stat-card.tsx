import { ArrowRight, type LucideIcon } from "lucide-react"
import Link from "next/link"

/**
 * Indicator din capul panoului. Afișează exclusiv o valoare numerică reală,
 * fără variații procentuale sau grafice.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  href,
  linkLabel,
  emphasis = false,
}: {
  label: string
  value: number
  icon: LucideIcon
  href: string
  linkLabel: string
  emphasis?: boolean
}) {
  return (
    <div className="flex flex-col rounded-xl border bg-background p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span
          className={
            emphasis && value > 0
              ? "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"
              : "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground"
          }
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <p className="mt-3 font-heading text-3xl font-bold tabular-nums leading-none text-foreground">
        {value}
      </p>

      <Link
        href={href}
        className="group mt-4 inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-primary outline-none transition-colors hover:text-primary-dark focus-visible:ring-2 focus-visible:ring-ring"
      >
        {linkLabel}
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </div>
  )
}
