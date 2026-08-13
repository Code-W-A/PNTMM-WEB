import { notFound } from "next/navigation"

import { AdminPageHeader } from "@/components/admin/ui/page-header"
import { DetailList, SectionCard } from "@/components/admin/ui/section-card"
import { formatDateTime } from "@/lib/datetime"
import { getContactMessage } from "@/services/admin/submissions-admin"

export const dynamic = "force-dynamic"

export const metadata = { title: "Mesaj de contact" }

export default async function ContactMessagePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const message = await getContactMessage((await params).id)

  if (!message) notFound()

  return (
    <>
      <AdminPageHeader
        backHref="/admin/formulare?tip=contact"
        backLabel="Formulare website"
        eyebrow="Mesaj de contact"
        title={message.subject}
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <SectionCard title="Mesaj" className="min-w-0">
          <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
            {message.message}
          </p>
        </SectionCard>

        <SectionCard title="Expeditor" className="xl:sticky xl:top-6">
          <DetailList
            items={[
              { label: "Nume", value: message.name },
              {
                label: "Email",
                value: (
                  <a
                    href={`mailto:${message.email}`}
                    className="break-all font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {message.email}
                  </a>
                ),
              },
              { label: "Primit la", value: formatDateTime(message.createdAt) },
            ]}
          />
        </SectionCard>
      </div>
    </>
  )
}
