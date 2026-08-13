import { Container } from "@/components/layout/container"
import type { AboutMilestone } from "@/types"

interface AboutMilestonesProps {
  milestones: AboutMilestone[]
}

/** Randat doar când există date verificate — fără mock history public. */
export function AboutMilestones({ milestones }: AboutMilestonesProps) {
  if (milestones.length === 0) return null

  const items = [...milestones].sort((a, b) => a.order - b.order)

  return (
    <section
      aria-labelledby="reperes-title"
      className="section-padding overflow-hidden border-t bg-muted/40"
    >
      <Container>
        <div className="max-w-3xl">
          <p className="eyebrow text-primary">Repere</p>
          <h2
            id="reperes-title"
            className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Povestea organizației
          </h2>
        </div>

        <ol className="mt-12 space-y-0 lg:flex lg:gap-0 lg:space-y-0 lg:overflow-x-auto lg:pb-2">
          {items.map((item, index) => (
            <li
              key={item.id}
              className="relative border-l border-border pl-8 pb-10 last:pb-0 sm:pl-10 lg:min-w-[16rem] lg:flex-1 lg:border-l-0 lg:border-t lg:pl-0 lg:pt-10 lg:pr-8"
            >
              <span
                aria-hidden="true"
                className="absolute left-0 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rotate-45 bg-accent lg:left-0 lg:top-0 lg:-translate-y-1/2 lg:translate-x-0"
              />
              <p className="meta text-primary/65">
                {item.date ?? item.year ?? String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-heading text-xl font-bold">{item.title}</h3>
              <p className="mt-2 max-w-sm leading-7 text-muted-foreground">
                {item.description}
              </p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  )
}
