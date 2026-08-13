import { notFound } from "next/navigation"

import { AdminPageHeader } from "@/components/admin/ui/page-header"
import { DetailList, SectionCard } from "@/components/admin/ui/section-card"
import { formatDateTime } from "@/lib/datetime"
import { getInterestSubmission } from "@/services/admin/submissions-admin"

export const dynamic = "force-dynamic"

export const metadata = { title: "Formular de interes" }

export default async function InterestSubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const submission = await getInterestSubmission((await params).id)

  if (!submission) notFound()

  const fullName = `${submission.firstName} ${submission.lastName}`.trim()

  return (
    <>
      <AdminPageHeader
        backHref="/admin/formulare?tip=interes"
        backLabel="Formulare website"
        eyebrow="Formular de interes"
        title={fullName}
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <SectionCard title="Mesaj" className="min-w-0">
          <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
            {submission.message}
          </p>
        </SectionCard>

        <SectionCard title="Persoană" className="xl:sticky xl:top-6">
          <DetailList
            items={[
              { label: "Nume", value: fullName },
              {
                label: "Email",
                value: (
                  <a
                    href={`mailto:${submission.email}`}
                    className="break-all font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {submission.email}
                  </a>
                ),
              },
              { label: "Telefon", value: submission.phone ?? "—" },
              { label: "Localitate", value: submission.locality ?? "—" },
              {
                label: "Primit la",
                value: formatDateTime(submission.createdAt),
              },
            ]}
          />
        </SectionCard>
      </div>
    </>
  )
}
