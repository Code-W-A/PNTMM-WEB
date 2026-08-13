import { EventList } from "@/components/events/event-list"
import { Container } from "@/components/layout/container"
import { PageHero } from "@/components/shared/page-hero"
import { createRomanianMetadata } from "@/lib/seo"
import { getEvents } from "@/services/content-service"

export const metadata = createRomanianMetadata({
  title: "Evenimente",
  description:
    "Calendarul întâlnirilor și evenimentelor PNȚMM Cluj, publicat după confirmarea detaliilor.",
  path: "/evenimente",
})

export const revalidate = 300

export default async function EventsPage() {
  const events = await getEvents()
  const now = Date.now()
  const upcomingEvents = events.filter(
    (event) => new Date(event.endDate || event.startDate).getTime() >= now,
  )
  const pastEvents = events.filter(
    (event) => new Date(event.endDate || event.startDate).getTime() < now,
  )

  return (
    <>
      <PageHero
        title="Evenimente"
        description="Aici vor fi publicate întâlnirile și evenimentele confirmate, cu toate detaliile necesare."
        currentLabel="Evenimente"
        eyebrow="Calendar"
        mediaLabel="Imagine ilustrativă"
      />
      <section className="py-16 sm:py-24">
        <Container className="space-y-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              În calendar
            </p>
            <h2 className="mt-3 font-heading text-2xl font-bold sm:text-3xl">
              Evenimente viitoare
            </h2>
            <div className="mt-8">
              <EventList items={upcomingEvents} />
            </div>
          </div>
          <div className="border-t pt-16">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Arhivă
            </p>
            <h2 className="mt-3 font-heading text-2xl font-bold sm:text-3xl">
              Evenimente trecute
            </h2>
            <div className="mt-8">
              <EventList items={pastEvents} />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
