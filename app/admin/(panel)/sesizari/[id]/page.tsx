import { notFound } from "next/navigation"

import { DetailList, SectionCard } from "@/components/admin/ui/section-card"
import { AdminPageHeader } from "@/components/admin/ui/page-header"
import { WorkflowBadge } from "@/components/admin/ui/status-badge"
import { WorkflowStatusSelect } from "@/components/admin/workflow-status-select"
import { formatDateTime } from "@/lib/datetime"
import {
  getReport,
  getReportPhotoUrl,
} from "@/services/admin/submissions-admin"

export const dynamic = "force-dynamic"

export const metadata = { title: "Detaliu sesizare" }

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const report = await getReport((await params).id)

  if (!report) notFound()

  const photoUrl = await getReportPhotoUrl(report)

  return (
    <>
      <AdminPageHeader
        backHref="/admin/sesizari"
        backLabel="Sesizări"
        eyebrow="Sesizare"
        title={report.subject}
        meta={<WorkflowBadge status={report.status} />}
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-6">
          <SectionCard title="Descriere">
            <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
              {report.description}
            </p>
          </SectionCard>

          {report.photoPath ? (
            <SectionCard
              title="Fotografie"
              description="Linkul este temporar și expiră în 15 minute."
            >
              {photoUrl ? (
                // Imagine privată din Cloud Storage, servită printr-un URL
                // semnat; nu trece prin optimizatorul de imagini.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photoUrl}
                  alt={`Fotografie atașată sesizării ${report.subject}`}
                  className="max-h-[32rem] w-auto rounded-lg border"
                />
              ) : (
                <p className="text-sm text-destructive" role="alert">
                  Fotografia nu a putut fi încărcată.
                </p>
              )}
            </SectionCard>
          ) : null}
        </div>

        <div className="space-y-6 xl:sticky xl:top-6">
          <SectionCard title="Stare">
            <WorkflowStatusSelect
              entity="sesizari"
              id={report.id}
              status={report.status}
            />
          </SectionCard>

          <SectionCard title="Expeditor">
            <DetailList
              items={[
                { label: "Nume", value: report.name },
                {
                  label: "Email",
                  value: (
                    <a
                      href={`mailto:${report.email}`}
                      className="break-all font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {report.email}
                    </a>
                  ),
                },
                {
                  label: "Primită la",
                  value: formatDateTime(report.createdAt),
                },
                {
                  label: "Cont asociat",
                  value: report.uid ?? "Fără cont autentificat",
                },
              ]}
            />
          </SectionCard>
        </div>
      </div>
    </>
  )
}
