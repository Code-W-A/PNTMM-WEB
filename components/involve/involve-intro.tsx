import { Container } from "@/components/layout/container"
import { Reveal, RevealItem, RevealStagger } from "@/components/shared/reveal"

interface InvolveIntroProps {
  eyebrow: string
  title: string
  description: string
  steps: ReadonlyArray<{ order: number; label: string }>
}

export function InvolveIntro({
  eyebrow,
  title,
  description,
  steps,
}: InvolveIntroProps) {
  return (
    <section className="border-b bg-muted/35 py-10 sm:py-12 lg:py-14">
      <Container className="max-w-[67.5rem]">
        <Reveal>
          <p className="eyebrow text-primary">{eyebrow}</p>
          <h2 className="mt-3 max-w-[22ch] text-balance font-heading text-[clamp(1.65rem,2.6vw,2.35rem)] font-bold tracking-tight">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            {description}
          </p>
        </Reveal>

        <RevealStagger className="mt-8 grid gap-0 border-y sm:grid-cols-3">
          {steps.map((step) => (
            <RevealItem
              key={step.order}
              className="group border-b py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:px-5 sm:py-6 sm:first:pl-0 sm:last:border-r-0 sm:last:pr-0"
            >
              <span className="meta text-primary/55">
                {String(step.order).padStart(2, "0")}
              </span>
              <span
                aria-hidden="true"
                className="mt-3 block h-0.5 w-8 origin-left bg-accent transition-transform duration-300 motion-reduce:transition-none group-hover:w-12"
              />
              <p className="mt-3 text-sm font-semibold leading-6 text-foreground sm:text-[0.95rem]">
                {step.label}
              </p>
            </RevealItem>
          ))}
        </RevealStagger>
      </Container>
    </section>
  )
}
