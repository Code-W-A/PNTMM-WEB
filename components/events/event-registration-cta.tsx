import { EventRegistrationForm } from "@/components/events/event-registration-form"
import type { FormSubmitAvailability } from "@/types"

interface EventRegistrationCtaProps {
  eventId: string
  enabled: boolean
  availability: FormSubmitAvailability
}

export function EventRegistrationCta({
  eventId,
  enabled,
  availability,
}: EventRegistrationCtaProps) {
  const canRegister = enabled && availability !== "unavailable"

  return (
    <section
      className="mt-10 overflow-hidden rounded-[1.5rem] border border-primary/15 bg-primary-dark p-6 text-white shadow-[0_22px_65px_-42px_rgba(24,37,99,0.9)] sm:p-8"
      aria-labelledby="event-registration-title"
    >
      <span className="text-xs font-bold uppercase tracking-[0.18em] text-accent">
        Participare
      </span>
      <h2
        id="event-registration-title"
        className="mt-3 font-heading text-xl font-bold"
      >
        {canRegister ? "Înscriere la eveniment" : "Participare"}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
        {canRegister
          ? "Completați datele de mai jos pentru a vă înscrie. Vă contactăm dacă apar modificări în program."
          : "Înscrierea online nu este activă pentru acest eveniment."}
      </p>

      {canRegister ? <EventRegistrationForm eventId={eventId} /> : null}
    </section>
  )
}
