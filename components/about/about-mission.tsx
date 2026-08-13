import { Container } from "@/components/layout/container"
import { EditorialMedia } from "@/components/shared/editorial-media"
import { Reveal } from "@/components/shared/reveal"
import type { AboutMission } from "@/types"

interface AboutMissionSectionProps {
  mission: AboutMission
}

export function AboutMissionSection({ mission }: AboutMissionSectionProps) {
  return (
    <section
      id="misiune"
      aria-labelledby="misiune-title"
      className="about-anchor section-padding relative isolate overflow-hidden bg-primary-dark text-white"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(125deg, transparent 0 62%, rgb(255 255 255 / 0.03) 62% 63%, transparent 63%), radial-gradient(circle at 90% 20%, rgb(255 212 59 / 0.08), transparent 28rem)",
        }}
      />

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow text-accent">{mission.eyebrow}</p>
            <span className="meta mt-5 block text-white/45">01</span>
            <span
              aria-hidden="true"
              className="mt-3 block h-1 w-12 bg-accent"
            />
            <h2
              id="misiune-title"
              className="mt-5 max-w-[16ch] text-balance font-heading text-[clamp(1.85rem,3.2vw,3rem)] font-bold tracking-tight"
            >
              {mission.title}
            </h2>
            <p className="mt-7 max-w-2xl font-heading text-[clamp(1.35rem,2.4vw,2.15rem)] font-bold leading-snug tracking-tight text-white">
              {mission.statement}
            </p>
            {mission.supportingText ? (
              <p className="mt-5 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
                {mission.supportingText}
              </p>
            ) : null}
          </Reveal>

          {mission.imageUrl ? (
            <Reveal delay={0.1} className="lg:col-span-5">
              <EditorialMedia
                imageUrl={mission.imageUrl}
                alt={mission.imageAlt ?? "Imagine editorială pentru misiune"}
                label={mission.isDemo ? "Imagine ilustrativă" : undefined}
                aspect="portrait"
                sizes="(min-width: 1024px) 38vw, 100vw"
                className="w-full border border-white/10 shadow-none"
              />
            </Reveal>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
