import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface ContentCardProps {
  title: string
  description: string
  href: string
  meta?: string
  linkLabel?: string
}

export function ContentCard({
  title,
  description,
  href,
  meta,
  linkLabel = "Citește mai mult",
}: ContentCardProps) {
  return (
    <article className="group flex h-full flex-col rounded-xl border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {meta ? (
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-primary">
          {meta}
        </p>
      ) : null}
      <h3 className="font-heading text-xl font-bold text-card-foreground">
        {title}
      </h3>
      <p className="mt-3 flex-1 leading-7 text-muted-foreground">
        {description}
      </p>
      <Link
        href={href}
        className="mt-6 inline-flex items-center gap-2 font-semibold text-primary outline-none transition group-hover:gap-3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
      >
        {linkLabel}
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </article>
  )
}
