import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CalendarDays, Clock, MapPin } from "lucide-react"

import { EventList } from "@/components/events/event-list"
import { EventRegistrationCta } from "@/components/events/event-registration-cta"
import { Container } from "@/components/layout/container"
import { COVER_ASPECT } from "@/components/shared/editorial-media"
import { PageHero } from "@/components/shared/page-hero"
import { SectionHeading } from "@/components/shared/section-heading"
import { siteConfig } from "@/config/site"
import {
  getEventBySlug,
  getEvents,
  getRelatedEvents,
} from "@/services/content-service"
import { getFormSubmitAvailability } from "@/services/form-service"

interface EventDetailPageProps {
  params: Promise<{ slug: string }>
}

const dateFormatter = new Intl.DateTimeFormat("ro-RO", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

export const revalidate = 300

export async function generateStaticParams() {
  return (await getEvents()).map(({ slug }) => ({ slug }))
}

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) {
    return { title: "Eveniment indisponibil" }
  }

  return {
    title: event.title,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      ...(siteConfig.domain && event.imageUrl
        ? { images: [event.imageUrl] }
        : {}),
    },
  }
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) {
    return notFound()
  }

  const related = await getRelatedEvents(event.slug)

  return (
    <>
      <article>
        <PageHero
          title={event.title}
          description={event.description}
          currentLabel={event.title}
          parent={{ href: "/evenimente", label: "Evenimente" }}
          eyebrow="Eveniment"
          imageUrl={event.imageUrl}
          mediaAlt={`Imagine pentru ${event.title}`}
          mediaLabel={event.location}
          mediaAspect={COVER_ASPECT}
          compact
          meta={
            <span className="font-semibold">
              {dateFormatter.format(new Date(event.startDate))}
            </span>
          }
        />

        <Container className="max-w-4xl py-12 sm:py-16 lg:py-20">
          <div className="grid gap-6 rounded-[1.5rem] border bg-card p-6 shadow-[0_18px_55px_-42px_rgba(24,37,99,0.7)] sm:grid-cols-2 sm:p-8">
            <p className="flex gap-3">
              <CalendarDays className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <strong className="block">Începe</strong>
                {dateFormatter.format(new Date(event.startDate))}
              </span>
            </p>
            {event.endDate ? (
              <p className="flex gap-3">
                <Clock className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  <strong className="block">Se încheie</strong>
                  {dateFormatter.format(new Date(event.endDate))}
                </span>
              </p>
            ) : null}
            <p className="flex gap-3 sm:col-span-2">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                <strong className="block">{event.location}</strong>
                {event.address}
              </span>
            </p>
          </div>
          <p className="mt-10 border-l-2 border-accent pl-5 text-lg leading-8 text-foreground/90">
            {event.description}
          </p>
          <EventRegistrationCta
            eventId={event.id}
            enabled={event.registrationEnabled}
            availability={getFormSubmitAvailability()}
          />
        </Container>
      </article>

      {related.length > 0 ? (
        <section className="border-t bg-muted/40 py-16">
          <Container>
            <SectionHeading title="Alte evenimente" eyebrow="Calendar" />
            <div className="mt-8">
              <EventList items={related} />
            </div>
          </Container>
        </section>
      ) : null}
    </>
  )
}
