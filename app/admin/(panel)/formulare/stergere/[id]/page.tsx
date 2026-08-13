import { notFound } from "next/navigation"

import { AdminPageHeader } from "@/components/admin/ui/page-header"
import { DetailList, SectionCard } from "@/components/admin/ui/section-card"
import { WorkflowBadge } from "@/components/admin/ui/status-badge"
import { WorkflowStatusSelect } from "@/components/admin/workflow-status-select"
import { formatDateTime } from "@/lib/datetime"
import { getDeletionRequest } from "@/services/admin/submissions-admin"

export const dynamic = "force-dynamic"

export const metadata = { title: "Cerere de ștergere" }

export default async function DeletionRequestPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const request = await getDeletionRequest((await params).id)

  if (!request) notFound()

  return (
    <>
      <AdminPageHeader
        backHref="/admin/formulare?tip=stergere"
        backLabel="Formulare website"
        eyebrow="Cerere de ștergere"
        title={request.email}
        meta={<WorkflowBadge status={request.status} />}
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <SectionCard title="Detalii cerere" className="min-w-0">
          {request.message ? (
            <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
              {request.message}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Cererea a fost trimisă fără detalii suplimentare.
            </p>
          )}
        </SectionCard>

        <div className="space-y-6 xl:sticky xl:top-6">
          <SectionCard title="Stare">
            <WorkflowStatusSelect
              entity="cereri-stergere"
              id={request.id}
              status={request.status}
            />
          </SectionCard>

          <SectionCard title="Solicitant">
            <DetailList
              items={[
                {
                  label: "Email",
                  value: (
                    <a
                      href={`mailto:${request.email}`}
                      className="break-all font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {request.email}
                    </a>
                  ),
                },
                {
                  label: "Cont asociat",
                  value: request.uid ?? "Fără cont autentificat",
                },
                {
                  label: "Primită la",
                  value: formatDateTime(request.createdAt),
                },
              ]}
            />
          </SectionCard>
        </div>
      </div>
    </>
  )
}
