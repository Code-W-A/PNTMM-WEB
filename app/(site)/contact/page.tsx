import { ContactInfo } from "@/components/contact/contact-info"
import { ContactForm } from "@/components/forms/contact-form"
import { Container } from "@/components/layout/container"
import { PageHero } from "@/components/shared/page-hero"
import { siteConfig } from "@/config/site"
import { contactPageContent } from "@/data/contact-content"
import {
  getDirectContactChannels,
  getSocialLinks,
} from "@/lib/contact-channels"
import { createRomanianMetadata } from "@/lib/seo"
import { getFormSubmitAvailability } from "@/services/form-service"
import { getSiteContent } from "@/services/site-content-service"

export const metadata = createRomanianMetadata({
  title: "Contact",
  description: contactPageContent.hero.description,
  path: "/contact",
})

export const revalidate = 300

export default async function ContactPage() {
  const content = contactPageContent
  const managed = await getSiteContent("contact")
  const channels = getDirectContactChannels(siteConfig.contact)
  const socialLinks = getSocialLinks(siteConfig.social)
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
      />

      <section className="section-padding bg-background">
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,42fr)_minmax(0,58fr)] lg:gap-12 xl:gap-14">
            <ContactInfo
              eyebrow={content.info.eyebrow}
              title={managed.infoTitle}
              intro={managed.infoIntro}
              channels={channels}
              socialHeading={content.socialHeading}
              socialLinks={socialLinks}
              reportCallout={content.reportCallout}
              involveCta={content.involveCta}
            />
            <ContactForm
              availability={availability}
              eyebrow={content.form.eyebrow}
              title={content.form.title}
              supportingText={content.form.supportingText}
              successTitle={content.form.successTitle}
              successMessage={content.form.successMessage}
              unavailableMessage={content.form.unavailableMessage}
              developmentNotice={content.form.developmentNotice}
            />
          </div>
        </Container>
      </section>
    </>
  )
}
