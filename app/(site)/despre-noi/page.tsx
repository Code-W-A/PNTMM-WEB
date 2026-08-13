import { AboutCommunity } from "@/components/about/about-community"
import { AboutCta } from "@/components/about/about-cta"
import { AboutDirections } from "@/components/about/about-directions"
import { AboutDocuments } from "@/components/about/about-documents"
import { AboutMilestones } from "@/components/about/about-milestones"
import { AboutMissionSection } from "@/components/about/about-mission"
import { AboutOrganization } from "@/components/about/about-organization"
import { AboutPageNav } from "@/components/about/about-page-nav"
import { AboutTeamSection } from "@/components/about/about-team-section"
import { AboutValues } from "@/components/about/about-values"
import { AboutWhoWeAreSection } from "@/components/about/about-who-we-are"
import { PageHero } from "@/components/shared/page-hero"
import { createRomanianMetadata } from "@/lib/seo"
import { getAboutContent } from "@/services/content-service"
import { getSiteContent } from "@/services/site-content-service"

export const metadata = createRomanianMetadata({
  title: "Despre noi",
  description:
    "Doctrina creștin-democrată, valorile și prioritățile asumate public de Partidul Național Țărănesc Maniu-Mihalache, prezentate de organizația Cluj.",
  path: "/despre-noi",
})

export const revalidate = 300

export default async function AboutUsPage() {
  const [about, managed] = await Promise.all([
    getAboutContent(),
    getSiteContent("about"),
  ])

  const navItems = [
    { id: "cine-suntem", label: "Cine suntem" },
    { id: "misiune", label: "Misiune" },
    { id: "valori", label: "Valori" },
    ...(about.directions.length > 0
      ? [{ id: "directii", label: "Direcții" }]
      : []),
    ...(about.organizationUnits.length > 0
      ? [{ id: "organizare", label: "Organizare" }]
      : []),
    ...(about.team.length > 0 ? [{ id: "echipa", label: "Echipa" }] : []),
  ]

  return (
    <>
      <PageHero
        title={managed.heroTitle}
        description={managed.heroDescription}
        currentLabel={about.hero.currentLabel}
        eyebrow={about.hero.eyebrow}
        mediaLabel={about.hero.mediaLabel}
        mediaAlt={about.hero.mediaAlt}
        imageUrl={about.hero.imageUrl}
        mediaAspect="landscape"
        mediaEmphasis
      />

      <AboutPageNav items={navItems} />

      <AboutWhoWeAreSection content={about.whoWeAre} />
      <AboutMissionSection
        mission={{ ...about.mission, statement: managed.missionStatement }}
      />
      <AboutValues values={about.values} />
      <AboutDirections
        intro={about.directionsIntro}
        directions={about.directions}
        sourceNote={about.sourceNote}
      />
      <AboutOrganization units={about.organizationUnits} />
      <AboutMilestones milestones={about.milestones} />
      {about.team.length > 0 ? (
        <AboutTeamSection intro={about.teamIntro} team={about.team} />
      ) : null}
      {about.communityItems.length > 0 ? (
        <AboutCommunity intro={about.communityIntro} items={about.communityItems} />
      ) : null}
      {about.documents.length > 0 ? <AboutDocuments documents={about.documents} /> : null}
      <AboutCta cta={about.cta} />
    </>
  )
}
