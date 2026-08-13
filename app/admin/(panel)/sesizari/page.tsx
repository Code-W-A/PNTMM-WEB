import { ReportsTable } from "@/components/admin/tables/reports-table"
import { AdminPageHeader } from "@/components/admin/ui/page-header"
import { listReports } from "@/services/admin/submissions-admin"

export const dynamic = "force-dynamic"

export const metadata = { title: "Sesizări" }

export default async function AdminReportsPage() {
  const items = await listReports(undefined, 200)

  return (
    <>
      <AdminPageHeader
        title="Sesizări"
        description="Datele sunt confidențiale și nu sunt publicate pe website."
      />

      <ReportsTable items={items} />
    </>
  )
}
