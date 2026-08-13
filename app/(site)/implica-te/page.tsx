import { InterestForm } from "@/components/forms/interest-form"
import { InvolveIntro } from "@/components/involve/involve-intro"
import { InvolveSecondaryCta } from "@/components/involve/involve-secondary-cta"
import { Container } from "@/components/layout/container"
import { Reveal } from "@/components/shared/reveal"
import { PageHero } from "@/components/shared/page-hero"
import { involvePageContent } from "@/data/involve-content"
import { createRomanianMetadata } from "@/lib/seo"
import { getFormSubmitAvailability } from "@/services/form-service"
import { getSiteContent } from "@/services/site-content-service"

export const metadata = createRomanianMetadata({
  title: "Implică-te",
  description: involvePageContent.hero.description,
  path: "/implica-te",
})

export const revalidate = 300

export default async function GetInvolvedPage() {
  const content = involvePageContent
  const managed = await getSiteContent("involvement")
  const availability = getFormSubmitAvailability()

  return (
    <>
      <PageHero
        title={content.hero.title}
        description={managed.heroDescription}
        currentLabel={content.hero.currentLabel}
        eyebrow={content.hero.eyebrow}
        mediaLabel={content.hero.mediaLabel}
        mediaAlt={content.hero.mediaAlt}
        imageUrl={content.hero.imageUrl}
        mediaAspect="landscape"
        compact
        mediaEmphasis
      />

      <InvolveIntro
        eyebrow={content.intro.eyebrow}
        title={managed.introTitle}
        description={managed.introDescription}
        steps={content.intro.steps}
      />

      <section className="bg-muted/35 pb-4 pt-10 sm:pt-12 lg:pb-6 lg:pt-14">
        <Container className="max-w-[67.5rem]">
          <Reveal>
            <InterestForm
              availability={availability}
              panel={content.panel}
              form={content.form}
            />
          </Reveal>
        </Container>
      </section>

      <InvolveSecondaryCta
        text={content.secondaryCta.text}
        linkLabel={content.secondaryCta.linkLabel}
        href={content.secondaryCta.href}
      />
    </>
  )
}
