import Link from "next/link"
import { ArrowRight, CalendarDays, MapPin } from "lucide-react"

import { COVER_ASPECT, EditorialMedia } from "@/components/shared/editorial-media"
import type { Event } from "@/types"

const dateFormatter = new Intl.DateTimeFormat("ro-RO", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
})

export function EventCard({ event }: { event: Event }) {
  return (
    <article className="group relative flex h-full min-w-0 flex-col overflow-hidden rounded-[1.5rem] border bg-card shadow-[0_18px_55px_-38px_rgba(24,37,99,0.7)] transition duration-500 motion-reduce:transition-none hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_28px_70px_-38px_rgba(24,37,99,0.85)] motion-reduce:hover:translate-y-0">
      <EditorialMedia
        imageUrl={event.imageUrl}
        alt={`Imagine pentru ${event.title}`}
        label={event.location}
        aspect={COVER_ASPECT}
        className="rounded-none shadow-none"
      />
      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-balance font-heading text-xl font-bold leading-snug">
          <Link
            href={`/evenimente/${event.slug}`}
            className="outline-none after:absolute after:inset-0 focus-visible:underline"
          >
            {event.title}
          </Link>
        </h2>
        <div className="mt-5 space-y-2 border-l-2 border-accent pl-4 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            {dateFormatter.format(new Date(event.startDate))}
          </p>
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            {event.location}
          </p>
        </div>
        <p className="mt-5 line-clamp-3 leading-7 text-muted-foreground">
          {event.description}
        </p>
        <Link
          href={`/evenimente/${event.slug}`}
          className="relative z-10 mt-6 inline-flex w-fit items-center gap-2 text-sm font-bold text-primary"
        >
          Vedeți detaliile
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  )
}
