import { ProposalsTable } from "@/components/admin/tables/proposals-table"
import { AdminPageHeader } from "@/components/admin/ui/page-header"
import { listProposals } from "@/services/admin/submissions-admin"

export const dynamic = "force-dynamic"

export const metadata = { title: "Propuneri" }

export default async function AdminProposalsPage() {
  const items = await listProposals(undefined, 200)

  return (
    <>
      <AdminPageHeader
        title="Propuneri"
        description="Propunerile nu sunt publicate automat pe website."
      />

      <ProposalsTable items={items} />
    </>
  )
}
