import type { Event } from "@/types"

import { EventCard } from "./event-card"

export function EventList({ items }: { items: Event[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed bg-card p-10 text-center text-muted-foreground shadow-sm">
        <span className="mx-auto mb-5 block h-1 w-12 bg-accent" aria-hidden="true" />
        <p className="font-heading text-lg font-bold text-foreground">
          Nu sunt anunțate evenimente în acest moment.
        </p>
      </div>
    )
  }

  return (
    <div className="grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
