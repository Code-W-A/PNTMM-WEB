import { EventsTable } from "@/components/admin/tables/events-table"
import { AdminPageHeader } from "@/components/admin/ui/page-header"
import { listAllEvents } from "@/services/admin/content-admin"

export const dynamic = "force-dynamic"

export const metadata = { title: "Evenimente" }

export default async function AdminEventsPage() {
  const items = await listAllEvents(200)

  return (
    <>
      <AdminPageHeader
        title="Evenimente"
        description="Evenimentele publicate apar în calendarul public al website-ului."
      />

      <EventsTable items={items} />
    </>
  )
}
