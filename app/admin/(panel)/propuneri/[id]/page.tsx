import { notFound } from "next/navigation"

import { AdminPageHeader } from "@/components/admin/ui/page-header"
import { DetailList, SectionCard } from "@/components/admin/ui/section-card"
import { WorkflowBadge } from "@/components/admin/ui/status-badge"
import { WorkflowStatusSelect } from "@/components/admin/workflow-status-select"
import { formatDateTime } from "@/lib/datetime"
import { getProposal } from "@/services/admin/submissions-admin"

export const dynamic = "force-dynamic"

export const metadata = { title: "Detaliu propunere" }

export default async function ProposalDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const proposal = await getProposal((await params).id)

  if (!proposal) notFound()

  return (
    <>
      <AdminPageHeader
        backHref="/admin/propuneri"
        backLabel="Propuneri"
        eyebrow="Propunere"
        title={proposal.title}
        meta={<WorkflowBadge status={proposal.status} />}
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <SectionCard title="Descriere" className="min-w-0">
          <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">
            {proposal.description}
          </p>
        </SectionCard>

        <div className="space-y-6 xl:sticky xl:top-6">
          <SectionCard title="Stare">
            <WorkflowStatusSelect
              entity="propuneri"
              id={proposal.id}
              status={proposal.status}
            />
          </SectionCard>

          <SectionCard title="Expeditor">
            <DetailList
              items={[
                { label: "Nume", value: proposal.name },
                {
                  label: "Email",
                  value: (
                    <a
                      href={`mailto:${proposal.email}`}
                      className="break-all font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {proposal.email}
                    </a>
                  ),
                },
                {
                  label: "Primită la",
                  value: formatDateTime(proposal.createdAt),
                },
                {
                  label: "Cont asociat",
                  value: proposal.uid ?? "Fără cont autentificat",
                },
              ]}
            />
          </SectionCard>
        </div>
      </div>
    </>
  )
}
