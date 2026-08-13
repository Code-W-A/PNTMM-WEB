import { Container } from "@/components/layout/container"
import { Reveal, RevealItem, RevealStagger } from "@/components/shared/reveal"
import type { OrganizationUnit } from "@/types"

interface AboutOrganizationProps {
  units: OrganizationUnit[]
}

export function AboutOrganization({ units }: AboutOrganizationProps) {
  if (units.length === 0) return null

  const items = [...units].sort((a, b) => a.order - b.order)

  return (
    <section
      id="organizare"
      aria-labelledby="organizare-title"
      className="about-anchor section-padding overflow-hidden bg-[hsl(var(--muted)/0.55)]"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-4">
            <p className="eyebrow text-primary">Organizare</p>
            <h2
              id="organizare-title"
              className="mt-3 max-w-[14ch] text-balance font-heading text-[clamp(1.85rem,3vw,2.75rem)] font-bold tracking-tight"
            >
              Cum suntem organizați
            </h2>
            <p className="mt-4 max-w-sm text-base leading-7 text-muted-foreground sm:text-lg">
              Schemă editorială DEMO. Structura oficială va înlocui aceste
              etichete după validare.
            </p>
          </Reveal>

          {/* Mobile: vertical timeline */}
          <ol className="relative space-y-0 border-l border-border pl-8 sm:pl-10 lg:hidden">
            {items.map((unit) => (
              <li key={unit.id} className="relative pb-9 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute -left-[2.15rem] top-1.5 flex h-4 w-4 items-center justify-center sm:-left-[2.65rem]"
                >
                  <span className="h-2.5 w-2.5 rotate-45 bg-accent" />
                </span>
                <span className="meta text-primary/65">
                  {String(unit.order).padStart(2, "0")}
                  {unit.isDemo ? " · DEMO" : ""}
                </span>
                <h3 className="mt-2 font-heading text-xl font-bold">
                  {unit.title}
                </h3>
                <p className="mt-2 leading-7 text-muted-foreground">
                  {unit.description}
                </p>
              </li>
            ))}
          </ol>

          {/* Desktop: 2×2 editorial nodes */}
          <RevealStagger className="relative hidden lg:col-span-8 lg:grid lg:grid-cols-2">
            {items.map((unit, index) => {
              const isRight = index % 2 === 1
              const isBottom = index >= 2
              return (
                <RevealItem key={unit.id} as="div">
                  <article
                    className={[
                      "relative min-h-[11rem] p-7",
                      !isRight ? "border-r border-border" : "",
                      !isBottom ? "border-b border-border" : "",
                    ].join(" ")}
                  >
                    <span className="meta text-primary/60">
                      {String(unit.order).padStart(2, "0")}
                      {unit.isDemo ? " · DEMO" : ""}
                    </span>
                    <span
                      aria-hidden="true"
                      className="mt-3 block h-0.5 w-8 bg-accent"
                    />
                    <h3 className="mt-4 font-heading text-xl font-bold">
                      {unit.title}
                    </h3>
                    <p className="mt-2 max-w-sm leading-7 text-muted-foreground">
                      {unit.description}
                    </p>
                  </article>
                </RevealItem>
              )
            })}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-accent"
            />
          </RevealStagger>
        </div>
      </Container>
    </section>
  )
}
