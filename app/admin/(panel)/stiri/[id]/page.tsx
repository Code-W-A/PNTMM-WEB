import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { NewsForm } from "@/components/admin/news-form"
import { AdminPageHeader } from "@/components/admin/ui/page-header"
import { ContentBadge } from "@/components/admin/ui/status-badge"
import { Button } from "@/components/ui/button"
import { getNewsDoc } from "@/services/admin/content-admin"

export const dynamic = "force-dynamic"

export const metadata = { title: "Editare știre" }

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const item = await getNewsDoc((await params).id)

  if (!item) notFound()

  return (
    <>
      <AdminPageHeader
        backHref="/admin/stiri"
        backLabel="Știri"
        eyebrow="Știre"
        title={item.title}
        meta={<ContentBadge status={item.status} />}
        actions={
          item.status === "published" ? (
            <Button asChild variant="outline">
              <Link
                href={`/stiri/${item.slug}`}
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
      <NewsForm item={item} />
    </>
  )
}
