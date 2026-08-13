import {
  ContactMessagesTable,
  DeletionRequestsTable,
  InterestSubmissionsTable,
} from "@/components/admin/tables/website-forms-tables"
import { LinkTabs } from "@/components/admin/ui/link-tabs"
import { AdminPageHeader } from "@/components/admin/ui/page-header"
import {
  listContactMessages,
  listDeletionRequests,
  listInterestSubmissions,
} from "@/services/admin/submissions-admin"

export const dynamic = "force-dynamic"

export const metadata = { title: "Formulare website" }

const TABS = ["contact", "interes", "stergere"] as const
type Tab = (typeof TABS)[number]

function resolveTab(value?: string): Tab {
  return TABS.includes(value as Tab) ? (value as Tab) : "contact"
}

export default async function AdminFormsPage({
  searchParams,
}: {
  searchParams: Promise<{ tip?: string }>
}) {
  const tab = resolveTab((await searchParams).tip)

  const [contactMessages, interestSubmissions, deletionRequests] =
    await Promise.all([
      listContactMessages(200),
      listInterestSubmissions(200),
      listDeletionRequests(200),
    ])

  return (
    <>
      <AdminPageHeader
        title="Formulare website"
        description="Mesajele primite prin formularele publice. Datele sunt confidențiale și nu sunt publicate."
      />

      <LinkTabs
        items={[
          {
            href: "/admin/formulare?tip=contact",
            label: "Contact",
            active: tab === "contact",
            count: contactMessages.length,
          },
          {
            href: "/admin/formulare?tip=interes",
            label: "Interes",
            active: tab === "interes",
            count: interestSubmissions.length,
          },
          {
            href: "/admin/formulare?tip=stergere",
            label: "Cereri de ștergere",
            active: tab === "stergere",
            count: deletionRequests.length,
          },
        ]}
      />

      {tab === "contact" ? (
        <ContactMessagesTable items={contactMessages} />
      ) : null}
      {tab === "interes" ? (
        <InterestSubmissionsTable items={interestSubmissions} />
      ) : null}
      {tab === "stergere" ? (
        <DeletionRequestsTable items={deletionRequests} />
      ) : null}
    </>
  )
}
