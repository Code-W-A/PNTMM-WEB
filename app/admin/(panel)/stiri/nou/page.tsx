import { NewsForm } from "@/components/admin/news-form"
import { AdminPageHeader } from "@/components/admin/ui/page-header"

export const metadata = { title: "Știre nouă" }

export default function NewNewsPage() {
  return (
    <>
      <AdminPageHeader
        backHref="/admin/stiri"
        backLabel="Știri"
        title="Știre nouă"
        description="Articolul este vizibil public doar după salvarea cu starea Publicat."
      />
      <NewsForm />
    </>
  )
}
