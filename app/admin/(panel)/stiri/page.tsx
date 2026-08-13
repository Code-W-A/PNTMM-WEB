import { NewsTable } from "@/components/admin/tables/news-table"
import { AdminPageHeader } from "@/components/admin/ui/page-header"
import { listAllNews } from "@/services/admin/content-admin"

export const dynamic = "force-dynamic"

export const metadata = { title: "Știri" }

export default async function AdminNewsPage() {
  const items = await listAllNews(200)

  return (
    <>
      <AdminPageHeader
        title="Știri"
        description="Articolele publicate apar pe website imediat după salvare."
      />

      <NewsTable items={items} />
    </>
  )
}
