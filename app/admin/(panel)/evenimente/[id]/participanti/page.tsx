import { notFound } from "next/navigation"

import { RegistrationsTable } from "@/components/admin/tables/registrations-table"
import { LinkTabs } from "@/components/admin/ui/link-tabs"
import { AdminPageHeader } from "@/components/admin/ui/page-header"
import { formatDateTime } from "@/lib/datetime"
import {
  getEventDoc,
  listEventRegistrations,
} from "@/services/admin/content-admin"

export const dynamic = "force-dynamic"

export const metadata = { title: "Participanți" }

export default async function EventRegistrationsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = await getEventDoc(id)

  if (!event) notFound()

  const registrations = await listEventRegistrations(id)

  return (
    <>
      <AdminPageHeader
        backHref="/admin/evenimente"
        backLabel="Evenimente"
        eyebrow="Eveniment"
        title={event.title}
        description={`${formatDateTime(event.startDate)} · ${event.location}`}
      />

      <LinkTabs
        items={[
          { href: `/admin/evenimente/${id}`, label: "Detalii", active: false },
          {
            href: `/admin/evenimente/${id}/participanti`,
            label: "Participanți",
            active: true,
            count: registrations.length,
          },
        ]}
      />

      <RegistrationsTable items={registrations} eventId={id} />
    </>
  )
}
