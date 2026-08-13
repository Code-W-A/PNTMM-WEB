import { Container } from "@/components/layout/container"
import { Reveal, RevealItem, RevealStagger } from "@/components/shared/reveal"
import type { AboutValue } from "@/types"

interface AboutValuesProps {
  values: AboutValue[]
}

export function AboutValues({ values }: AboutValuesProps) {
  const items = [...values].sort((a, b) => a.order - b.order)

  return (
    <section
      id="valori"
      aria-labelledby="valori-title"
      className="about-anchor section-padding overflow-hidden bg-background"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 lg:gap-x-12">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow text-primary">Valori</p>
            <h2
              id="valori-title"
              className="mt-3 max-w-[14ch] text-balance font-heading text-[clamp(1.85rem,3vw,2.75rem)] font-bold tracking-tight"
            >
              Valorile și principiile noastre
            </h2>
            <p className="mt-4 max-w-sm leading-7 text-muted-foreground">
              Reperele de mai jos rezumă valorile declarate public de PNȚMM.
            </p>
          </Reveal>

          <RevealStagger className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:col-span-8">
            {items.map((value) => (
              <RevealItem key={value.id} as="div">
                <article className="group border-t border-border pt-5">
                  <span className="meta text-primary/60">
                    {String(value.order).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden="true"
                    className="mt-3 block h-0.5 w-8 bg-accent ui-transition group-hover:w-14"
                  />
                  <h3 className="mt-4 font-heading text-xl font-bold ui-transition group-hover:-translate-y-0.5 group-hover:text-primary sm:text-[1.35rem]">
                    {value.title}
                  </h3>
                  <p className="mt-2 max-w-sm leading-7 text-muted-foreground">
                    {value.description}
                  </p>
                </article>
              </RevealItem>
            ))}
          </RevealStagger>
        </div>
      </Container>
    </section>
  )
}
