import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  Lightbulb,
  Mail,
  MapPin,
  MessageSquareText,
} from "lucide-react"

import { CinematicHero } from "@/components/home/cinematic-hero"
import { Container } from "@/components/layout/container"
import { EditorialMedia } from "@/components/shared/editorial-media"
import { Button } from "@/components/ui/button"
import { isUpcomingEvent, prioritizeHomepageEvents } from "@/lib/events"
import type { Event, NewsItem } from "@/types"

const newsDateFormatter = new Intl.DateTimeFormat("ro-RO", {
  day: "numeric",
  month: "long",
  year: "numeric",
})

const eventDateFormatter = new Intl.DateTimeFormat("ro-RO", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

const identityItems = [
  {
    number: "01",
    title: "Doctrină",
    description:
      "Creștin-democrație, cu trei componente care se susțin reciproc: democrația, morala creștină și dreptatea socială.",
  },
  {
    number: "02",
    title: "Valori",
    description:
      "Morala creștină, patriotismul luminat, dreptatea socială și democrația desăvârșită, moștenite de la înaintași.",
  },
  {
    number: "03",
    title: "Direcție",
    description:
      "O Românie dezvoltată sustenabil, membră a Uniunii Europene și a NATO, în parteneriat strategic cu Statele Unite.",
  },
]

const contactActions = [
  {
    title: "Trimiteți o sesizare",
    description: "Trimiteți un mesaj despre o situație care vă preocupă.",
    href: "/sesizari",
    icon: MessageSquareText,
    private: true,
  },
  {
    title: "Propuneți o idee",
    description: "Împărtășiți o idee pentru comunitate.",
    href: "/propuneri",
    icon: Lightbulb,
    private: true,
  },
  {
    title: "Contact general",
    description: "Pentru întrebări sau un mesaj general.",
    href: "/contact",
    icon: Mail,
    private: false,
  },
]

interface EditorialHomeProps {
  news: NewsItem[]
  events: Event[]
}

export function EditorialHome({
  news,
  events,
}: EditorialHomeProps) {
  const projectSlots = [
    {
      id: "renastere-morala",
      title: "Renașterea morală a României",
      summary:
        "Familia, școala, cultura și biserica, susținute de o justiție puternică și dreaptă, meritocrație și toleranță zero față de corupție.",
      label: "Imagine ilustrativă",
      imageUrl: "/demo/project-01.jpg",
      imageAlt: "Imagine ilustrativă pentru renașterea morală",
    },
    {
      id: "dezvoltare-economica",
      title: "Dezvoltare economică accelerată",
      summary:
        "Învățământ, cercetare și digitalizare, sprijin pentru antreprenoriat, agricultură și sate.",
      label: "Imagine ilustrativă",
      imageUrl: "/demo/project-02.jpg",
      imageAlt: "Imagine ilustrativă pentru dezvoltare economică",
    },
    {
      id: "reforma-electorala",
      title: "Reformă electorală",
      summary:
        "Drept efectiv de vot pentru fiecare cetățean român, oriunde s-ar afla, și alegeri locale în două tururi.",
      label: "Imagine ilustrativă",
      imageUrl: "/demo/project-03.jpg",
      imageAlt: "Imagine ilustrativă pentru reforma electorală",
    },
  ] as const

  const featuredNews = news[0]
  const secondaryNews = news.slice(1, 3)
  const prioritizedEvents = prioritizeHomepageEvents(events)
  const featuredEvent = prioritizedEvents[0]
  const secondaryEvents = prioritizedEvents.slice(1, 3)
  const featuredIsUpcoming = featuredEvent
    ? isUpcomingEvent(featuredEvent)
    : false

  return (
    <>
      <CinematicHero />

      <section
        id="misiune"
        aria-labelledby="identity-title"
        className="section-padding overflow-hidden"
      >
        <Container>
          <div className="grid items-end gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <p className="eyebrow text-primary">Identitate</p>
              <h2
                id="identity-title"
                className="mt-5 max-w-xl font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
              >
                Reperele care ne definesc
              </h2>
            </div>
            <div className="border-l-2 border-accent pl-5 sm:pl-8">
              <p className="body-lg max-w-2xl text-muted-foreground">
                PNȚMM își asumă tradiția național-țărănistă și o viziune
                creștin-democrată asupra societății și a vieții publice.
              </p>
            </div>
          </div>

          <div className="mt-14 grid border-y md:grid-cols-3">
            {identityItems.map((item) => (
              <article
                key={item.title}
                className="group flex h-full flex-col border-b py-8 last:border-b-0 md:border-b-0 md:border-r md:px-8 md:py-10 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
              >
                <span className="meta text-primary/65">{item.number}</span>
                <h3 className="mt-7 font-heading text-2xl font-bold">
                  {item.title}
                </h3>
                <p className="mt-4 flex-1 leading-7 text-muted-foreground">
                  {item.description}
                </p>
                <span
                  aria-hidden="true"
                  className="mt-8 block h-1 w-10 bg-accent ui-transition group-hover:w-20"
                />
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="projects-title"
        className="section-padding relative overflow-hidden bg-muted/45"
      >
        <div
          aria-hidden="true"
          className="absolute -right-28 top-24 h-64 w-64 rotate-12 border border-primary/[0.07]"
        />
        <Container className="relative">
          <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="eyebrow text-primary">Repere de acțiune</p>
              <h2
                id="projects-title"
                className="mt-5 max-w-3xl font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              >
                Direcții pentru binele comun
              </h2>
              <p className="body-lg mt-6 max-w-2xl text-muted-foreground">
                Prioritățile asumate public de PNȚMM la nivel național.
                Imaginile au rol ilustrativ și nu documentează activități
                locale.
              </p>
            </div>
            <Button asChild variant="outline" className="w-fit">
              <Link href="/despre-noi#directii">
                Vedeți direcțiile <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-4 sm:gap-5 lg:grid-cols-3 lg:grid-rows-[30rem_25rem]">
            <article className="group relative min-h-[27rem] overflow-hidden radius-card lg:col-span-2">
              <EditorialMedia
                imageUrl={projectSlots[0].imageUrl}
                alt={projectSlots[0].imageAlt}
                label={projectSlots[0].label}
                aspect="landscape"
                className="absolute inset-0 h-full w-full !aspect-auto rounded-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
                <p className="meta text-accent">{projectSlots[0].label}</p>
                <h3 className="mt-3 max-w-2xl font-heading text-3xl font-bold sm:text-4xl">
                  {projectSlots[0].title}
                </h3>
                <p className="mt-3 max-w-xl leading-7 text-white/80">
                  {projectSlots[0].summary}
                </p>
              </div>
            </article>

            <article className="group relative min-h-[27rem] overflow-hidden radius-card">
              <EditorialMedia
                imageUrl={projectSlots[1].imageUrl}
                alt={projectSlots[1].imageAlt}
                label={projectSlots[1].label}
                aspect="portrait"
                className="absolute inset-0 h-full w-full !aspect-auto rounded-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="meta text-accent">{projectSlots[1].label}</p>
                <h3 className="mt-3 font-heading text-2xl font-bold">
                  {projectSlots[1].title}
                </h3>
                <p className="mt-3 leading-7 text-white/80">
                  {projectSlots[1].summary}
                </p>
              </div>
            </article>

            <article className="group relative min-h-[24rem] overflow-hidden radius-card lg:col-span-2 lg:col-start-2">
              <EditorialMedia
                imageUrl={projectSlots[2].imageUrl}
                alt={projectSlots[2].imageAlt}
                label={projectSlots[2].label}
                aspect="landscape"
                className="absolute inset-0 h-full w-full !aspect-auto rounded-none"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/45 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex max-w-xl flex-col justify-end p-6 text-white sm:p-8">
                <p className="meta text-accent">{projectSlots[2].label}</p>
                <h3 className="mt-3 font-heading text-3xl font-bold">
                  {projectSlots[2].title}
                </h3>
                <p className="mt-3 leading-7 text-white/80">
                  {projectSlots[2].summary}
                </p>
              </div>
            </article>
          </div>
        </Container>
      </section>

      <section
        aria-labelledby="news-title"
        className="section-padding overflow-hidden"
      >
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow text-primary">Actualitate</p>
              <h2
                id="news-title"
                className="mt-5 font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              >
                Știri și comunicate
              </h2>
            </div>
            <Link
              href="/stiri"
              className="inline-flex min-h-10 items-center gap-2 border-b border-foreground pb-1 font-semibold outline-none ui-transition hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring"
            >
              Toate știrile <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          {featuredNews ? (
            <div className="mt-12 grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-12">
              <article className="group">
                <Link
                  href={`/stiri/${featuredNews.slug}`}
                  className="block rounded-[var(--radius-card)] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
                >
                  <EditorialMedia
                    imageUrl={featuredNews.imageUrl}
                    alt={`Imagine pentru ${featuredNews.title}`}
                    label="Știre"
                    aspect="landscape"
                    className="radius-card"
                  />
                  <div className="mt-6 max-w-3xl">
                    <p className="meta text-primary">
                      {featuredNews.category} ·{" "}
                      {newsDateFormatter.format(
                        new Date(featuredNews.publishedAt),
                      )}
                    </p>
                    <h3 className="mt-3 font-heading text-3xl font-bold leading-tight ui-transition group-hover:text-primary sm:text-4xl">
                      {featuredNews.title}
                    </h3>
                    <p className="body-lg mt-4 text-muted-foreground">
                      {featuredNews.excerpt}
                    </p>
                  </div>
                </Link>
              </article>

              <div className="divide-y border-y">
                {secondaryNews.map((item, index) => (
                  <article key={item.id} className="group py-5 sm:py-6">
                    <Link
                      href={`/stiri/${item.slug}`}
                      className="grid gap-4 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 sm:grid-cols-[9.5rem_1fr] sm:items-start sm:gap-5"
                    >
                      <EditorialMedia
                        imageUrl={item.imageUrl}
                        alt={`Imagine pentru ${item.title}`}
                        label={`Știre ${String(index + 2).padStart(2, "0")}`}
                        aspect="card"
                        className="rounded-xl shadow-none"
                      />
                      <div className="min-w-0">
                        <p className="meta text-primary">
                          {item.category} ·{" "}
                          {newsDateFormatter.format(new Date(item.publishedAt))}
                        </p>
                        <h3 className="mt-2.5 font-heading text-xl font-bold leading-snug ui-transition group-hover:text-primary sm:text-2xl">
                          {item.title}
                        </h3>
                        <p className="mt-2.5 line-clamp-2 leading-7 text-muted-foreground">
                          {item.excerpt}
                        </p>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-12 rounded-[var(--radius-card)] border border-dashed p-10 text-center text-muted-foreground">
              Știrile și comunicatele validate vor fi publicate aici.
            </p>
          )}
        </Container>
      </section>

      <section
        aria-labelledby="events-title"
        className="section-padding overflow-hidden bg-primary-dark text-white"
      >
        <Container>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="eyebrow text-accent">Calendar</p>
              <h2
                id="events-title"
                className="mt-5 max-w-3xl font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
              >
                Întâlniri și evenimente
              </h2>
              <p className="mt-5 max-w-2xl leading-7 text-white/72">
                Aici vor fi publicate întâlnirile și evenimentele confirmate.
              </p>
            </div>
            <Link
              href="/evenimente"
              className="inline-flex min-h-10 w-fit items-center gap-2 border-b border-white/55 pb-1 font-semibold outline-none ui-transition hover:border-accent hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-primary-dark"
            >
              Calendar complet <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>

          {featuredEvent ? (
            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              <article className="overflow-hidden radius-card border border-white/15 bg-white/[0.06]">
                <EditorialMedia
                  imageUrl={featuredEvent.imageUrl}
                  alt={`Imagine pentru ${featuredEvent.title}`}
                  label="Eveniment"
                  aspect="landscape"
                  className="rounded-none shadow-none"
                />
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <p className="flex items-center gap-2 text-sm font-bold text-accent">
                      <CalendarDays aria-hidden="true" className="h-4 w-4" />
                      {eventDateFormatter.format(
                        new Date(featuredEvent.startDate),
                      )}
                    </p>
                    {!featuredIsUpcoming ? (
                      <span className="rounded border border-white/20 px-2 py-0.5 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-white/70">
                        Încheiat
                      </span>
                    ) : null}
                  </div>
                  <h3 className="mt-4 font-heading text-2xl font-bold sm:text-3xl">
                    <Link
                      href={`/evenimente/${featuredEvent.slug}`}
                      className="outline-none ui-transition hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {featuredEvent.title}
                    </Link>
                  </h3>
                  <p className="mt-4 leading-7 text-white/70">
                    {featuredEvent.description}
                  </p>
                  <p className="mt-5 flex items-center gap-2 text-sm text-white/65">
                    <MapPin aria-hidden="true" className="h-4 w-4 shrink-0" />
                    {featuredEvent.location}
                  </p>
                  {featuredIsUpcoming ? (
                    <Button
                      asChild
                      variant="secondaryOutline"
                      className="mt-6 w-fit focus-visible:ring-accent focus-visible:ring-offset-primary-dark"
                    >
                      <Link href={`/evenimente/${featuredEvent.slug}`}>
                        Vedeți detaliile <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                  ) : null}
                </div>
              </article>

              <div className="grid gap-5">
                {secondaryEvents.map((event, index) => {
                  const upcoming = isUpcomingEvent(event)

                  return (
                    <article
                      key={event.id}
                      className="grid overflow-hidden radius-card border border-white/15 bg-white/[0.06] sm:grid-cols-[12rem_1fr]"
                    >
                      <EditorialMedia
                        imageUrl={event.imageUrl}
                        alt={`Imagine pentru ${event.title}`}
                        label={`Eveniment ${index + 2}`}
                        aspect="card"
                        className="h-full min-h-48 !aspect-auto rounded-none shadow-none"
                      />
                      <div className="flex flex-col justify-center p-6">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                          <p className="meta text-accent">
                            {eventDateFormatter.format(new Date(event.startDate))}
                          </p>
                          {!upcoming ? (
                            <span className="rounded border border-white/20 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white/70">
                              Încheiat
                            </span>
                          ) : null}
                        </div>
                        <h3 className="mt-3 font-heading text-xl font-bold">
                          <Link
                            href={`/evenimente/${event.slug}`}
                            className="outline-none ui-transition hover:text-accent focus-visible:ring-2 focus-visible:ring-accent"
                          >
                            {event.title}
                          </Link>
                        </h3>
                        <p className="mt-3 line-clamp-2 leading-7 text-white/70">
                          {event.description}
                        </p>
                        <p className="mt-4 flex items-center gap-2 text-sm text-white/65">
                          <MapPin aria-hidden="true" className="h-4 w-4 shrink-0" />
                          {event.location}
                        </p>
                        {upcoming ? (
                          <Link
                            href={`/evenimente/${event.slug}`}
                            className="mt-4 inline-flex min-h-9 w-fit items-center gap-1.5 text-sm font-semibold text-accent outline-none ui-transition hover:text-white focus-visible:ring-2 focus-visible:ring-accent"
                          >
                            Vedeți detaliile
                            <ArrowRight aria-hidden="true" className="h-4 w-4" />
                          </Link>
                        ) : null}
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          ) : (
            <p className="mt-12 rounded-[var(--radius-card)] border border-dashed border-white/25 p-10 text-center text-white/70">
              Nu sunt anunțate evenimente în acest moment.
            </p>
          )}
        </Container>
      </section>

      <section className="section-padding-sm overflow-hidden bg-accent text-accent-foreground">
        <Container className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
          <div className="max-w-3xl">
            <p className="eyebrow opacity-70">Participare</p>
            <h2 className="mt-4 font-heading text-3xl font-bold leading-tight sm:text-5xl">
              Alegeți cum doriți să vă implicați
            </h2>
            <p className="mt-4 max-w-2xl leading-7 opacity-75">
              Completați formularul de interes sau trimiteți-ne o întrebare.
            </p>
          </div>
          <Button asChild variant="onAccent" size="lg" className="w-fit">
            <Link href="/implica-te">
              Formular de interes <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </Container>
      </section>

      <section
        aria-labelledby="contact-title"
        className="section-padding overflow-hidden"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow text-primary">Dialog direct</p>
              <h2
                id="contact-title"
                className="mt-5 font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
              >
                Sesizări, propuneri și contact
              </h2>
              <p className="body-lg mt-5 max-w-xl text-muted-foreground">
                Alegeți tipul mesajului potrivit sau folosiți formularul de
                contact pentru o întrebare generală.
              </p>
              <EditorialMedia
                imageUrl="/demo/contact-dialog.jpg"
                alt="Imagine demonstrativă pentru zona de dialog și contact"
                aspect="landscape"
                className="mt-8"
              />
            </div>

            <div className="divide-y border-y">
              {contactActions.map(
                ({ title, description, href, icon: Icon, private: isPrivate }, index) => (
                  <Link
                    key={title}
                    href={href}
                    className="group grid grid-cols-[auto_1fr_auto] items-center gap-4 px-3 py-7 outline-none ui-transition hover:bg-muted/55 focus-visible:bg-muted/55 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:gap-6 sm:px-4 sm:py-8"
                  >
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary sm:h-14 sm:w-14">
                      <Icon aria-hidden="true" className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="meta text-primary/65">0{index + 1}</span>
                        {isPrivate ? (
                          <span className="rounded border border-primary/20 bg-primary/[0.06] px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-primary/70">
                            Privat
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-1 block font-heading text-xl font-bold sm:text-2xl">
                        {title}
                      </span>
                      <span className="mt-2 block text-sm leading-6 text-muted-foreground sm:text-base">
                        {description}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden="true"
                      className="h-5 w-5 ui-transition group-hover:translate-x-1"
                    />
                  </Link>
                ),
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
