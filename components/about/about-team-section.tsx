import { Users } from "lucide-react"

import { Container } from "@/components/layout/container"
import { Reveal } from "@/components/shared/reveal"
import { TeamMemberCard } from "@/components/team-member-card"
import type { TeamMember } from "@/types"

interface AboutTeamSectionProps {
  intro: string
  team: TeamMember[]
}

export function AboutTeamSection({ intro, team }: AboutTeamSectionProps) {
  const members = [...team].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0),
  )

  return (
    <section
      id="echipa"
      aria-labelledby="echipa-title"
      className="about-anchor section-padding overflow-hidden bg-background"
    >
      <Container>
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-primary">Oameni</p>
          <h2
            id="echipa-title"
            className="mt-3 font-heading text-[clamp(1.85rem,3vw,2.75rem)] font-bold tracking-tight"
          >
            Echipa
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            {intro}
          </p>
        </Reveal>

        {members.length > 0 ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {members.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <Reveal delay={0.06}>
            <div className="mx-auto mt-8 max-w-xl rounded-[var(--radius-card)] border border-dashed bg-muted/30 px-6 py-10 text-center sm:px-8 sm:py-11">
              <Users
                className="mx-auto h-8 w-8 text-muted-foreground"
                aria-hidden="true"
              />
              <h3 className="mt-4 font-heading text-lg font-bold sm:text-xl">
                Profilurile echipei sunt în pregătire
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                Nu afișăm persoane demonstrative. Membrii echipei vor apărea aici
                după verificarea și aprobarea datelor.
              </p>
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  )
}
