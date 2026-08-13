import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { EventForm } from "@/components/admin/event-form"
import { LinkTabs } from "@/components/admin/ui/link-tabs"
import { AdminPageHeader } from "@/components/admin/ui/page-header"
import {
  ContentBadge,
  EventTimingBadge,
} from "@/components/admin/ui/status-badge"
import { Button } from "@/components/ui/button"
import { getEventDoc } from "@/services/admin/content-admin"

export const dynamic = "force-dynamic"

export const metadata = { title: "Editare eveniment" }

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const item = await getEventDoc(id)

  if (!item) notFound()

  const upcoming =
    new Date(item.endDate ?? item.startDate).getTime() >= Date.now()

  return (
    <>
      <AdminPageHeader
        backHref="/admin/evenimente"
        backLabel="Evenimente"
        eyebrow="Eveniment"
        title={item.title}
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <ContentBadge status={item.status} />
            <EventTimingBadge upcoming={upcoming} />
          </div>
        }
        actions={
          item.status === "published" ? (
            <Button asChild variant="outline">
              <Link
                href={`/evenimente/${item.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink aria-hidden="true" />
                Vezi pe website
              </Link>
            </Button>
          ) : null
        }
      />

      <LinkTabs
        items={[
          { href: `/admin/evenimente/${id}`, label: "Detalii", active: true },
          {
            href: `/admin/evenimente/${id}/participanti`,
            label: "Participanți",
            active: false,
          },
        ]}
      />

      <EventForm item={item} />
    </>
  )
}
