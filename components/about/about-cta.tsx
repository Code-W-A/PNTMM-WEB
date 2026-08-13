import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Container } from "@/components/layout/container"
import { Reveal } from "@/components/shared/reveal"
import { Button } from "@/components/ui/button"
import type { AboutPageContent } from "@/types"

interface AboutCtaProps {
  cta: AboutPageContent["cta"]
}

export function AboutCta({ cta }: AboutCtaProps) {
  return (
    <section
      aria-labelledby="about-cta-title"
      className="section-padding-sm overflow-hidden bg-primary-dark text-white"
    >
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-7">
            <p className="eyebrow text-accent">Participare</p>
            <h2
              id="about-cta-title"
              className="mt-3 max-w-[16ch] text-balance font-heading text-[clamp(1.85rem,3.2vw,3rem)] font-bold tracking-tight"
            >
              {cta.title}
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-white/72">
              {cta.description}
            </p>
          </div>
          <div className="flex flex-col gap-3 min-[380px]:flex-row lg:col-span-5 lg:justify-end">
            <Button asChild variant="accent" size="lg" className="w-fit">
              <Link href={cta.primaryHref}>
                {cta.primaryLabel}
                <ArrowRight
                  aria-hidden="true"
                  className="ui-transition group-hover:translate-x-1"
                />
              </Link>
            </Button>
            <Button
              asChild
              variant="secondaryOutline"
              size="lg"
              className="w-fit focus-visible:ring-accent focus-visible:ring-offset-primary-dark"
            >
              <Link href={cta.secondaryHref}>{cta.secondaryLabel}</Link>
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
