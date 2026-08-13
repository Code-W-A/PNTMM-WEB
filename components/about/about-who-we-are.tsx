import { Container } from "@/components/layout/container"
import { EditorialMedia } from "@/components/shared/editorial-media"
import { Reveal } from "@/components/shared/reveal"
import type { AboutWhoWeAre } from "@/types"

interface AboutWhoWeAreSectionProps {
  content: AboutWhoWeAre
}

export function AboutWhoWeAreSection({ content }: AboutWhoWeAreSectionProps) {
  return (
    <section
      id="cine-suntem"
      aria-labelledby="cine-suntem-title"
      className="about-anchor section-padding overflow-hidden bg-background"
    >
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
          <Reveal className="lg:col-span-5">
            <EditorialMedia
              imageUrl={content.imageUrl}
              alt={
                content.imageAlt ??
                "Imagine editorială pentru secțiunea Cine suntem"
              }
              label={content.isDemo ? "Imagine ilustrativă" : undefined}
              aspect="portrait"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="w-full shadow-[0_18px_50px_-36px_rgba(24,37,99,0.55)] lg:-mt-1"
            />
          </Reveal>

          <Reveal
            delay={0.08}
            className="min-w-0 lg:col-span-6 lg:col-start-7"
          >
            <p className="eyebrow text-primary">{content.eyebrow}</p>
            <h2
              id="cine-suntem-title"
              className="mt-3 max-w-[18ch] text-balance font-heading text-[clamp(1.85rem,3.2vw,3rem)] font-bold tracking-tight"
            >
              {content.title}
            </h2>
            <div className="mt-7 max-w-xl space-y-5 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {content.paragraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={
                    index === 0
                      ? "text-foreground/90 sm:text-xl sm:leading-8"
                      : undefined
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}
