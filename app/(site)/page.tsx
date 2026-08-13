import type { Metadata } from "next"

import { EditorialHome } from "@/components/home/editorial-home"
import { OrganizationJsonLd } from "@/components/seo/organization-jsonld"
import { createRomanianMetadata } from "@/lib/seo"
import { getEvents, getNews } from "@/services/content-service"

export const metadata: Metadata = createRomanianMetadata({
  title: "Acasă",
  description:
    "Organizația Cluj a Partidului Național Țărănesc Maniu-Mihalache: doctrină creștin-democrată, știri, evenimente și modalități de implicare.",
  path: "/",
})

export const revalidate = 300

export default async function HomePage() {
  const [news, events] = await Promise.all([getNews(), getEvents()])

  return (
    <>
      <OrganizationJsonLd />
      <EditorialHome news={news} events={events} />
    </>
  )
}
