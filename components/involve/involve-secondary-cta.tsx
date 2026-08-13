import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Container } from "@/components/layout/container"

interface InvolveSecondaryCtaProps {
  text: string
  linkLabel: string
  href: string
}

export function InvolveSecondaryCta({
  text,
  linkLabel,
  href,
}: InvolveSecondaryCtaProps) {
  return (
    <section className="pb-12 pt-8 sm:pb-14 sm:pt-9">
      <Container className="max-w-[67.5rem]">
        <p className="text-sm leading-6 text-muted-foreground sm:text-base">
          {text}{" "}
          <Link
            href={href}
            className="group inline-flex items-center gap-1 font-semibold text-primary outline-none ui-transition hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-ring"
          >
            {linkLabel}
            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5 ui-transition group-hover:translate-x-1"
            />
          </Link>
        </p>
      </Container>
    </section>
  )
}
