import type { Event } from "@/types"

function startTime(event: Event) {
  return new Date(event.startDate).getTime()
}

/** Upcoming first (asc), then past (desc). Uses startDate only. */
export function prioritizeHomepageEvents(events: Event[], now = Date.now()) {
  const upcoming = events
    .filter((event) => startTime(event) >= now)
    .sort((a, b) => startTime(a) - startTime(b))

  const past = events
    .filter((event) => startTime(event) < now)
    .sort((a, b) => startTime(b) - startTime(a))

  return [...upcoming, ...past]
}

export function isUpcomingEvent(event: Event, now = Date.now()) {
  return startTime(event) >= now
}
