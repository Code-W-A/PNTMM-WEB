import type { LucideIcon } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

/** Acțiune de rând reprezentată doar prin pictogramă, cu nume accesibil. */
export function RowActionLink({
  href,
  label,
  icon: Icon,
  external = false,
}: {
  href: string
  label: string
  icon: LucideIcon
  external?: boolean
}) {
  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
    >
      <Link
        href={href}
        aria-label={label}
        title={label}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <Icon aria-hidden="true" />
      </Link>
    </Button>
  )
}
