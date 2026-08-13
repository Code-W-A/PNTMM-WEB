import { EventForm } from "@/components/admin/event-form"
import { AdminPageHeader } from "@/components/admin/ui/page-header"

export const metadata = { title: "Eveniment nou" }

export default function NewEventPage() {
  return (
    <>
      <AdminPageHeader
        backHref="/admin/evenimente"
        backLabel="Evenimente"
        title="Eveniment nou"
        description="Evenimentul devine vizibil public după salvarea cu starea Publicat."
      />
      <EventForm />
    </>
  )
}
