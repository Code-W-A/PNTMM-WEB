import { UsersTable } from "@/components/admin/tables/users-table"
import { AdminPageHeader } from "@/components/admin/ui/page-header"
import { listUsers } from "@/services/admin/users-admin"

export const dynamic = "force-dynamic"

export const metadata = { title: "Utilizatori" }

export default async function AdminUsersPage() {
  const users = await listUsers(200)

  return (
    <>
      <AdminPageHeader
        title="Utilizatori"
        description="Parolele nu sunt vizibile și nu pot fi consultate din panou."
      />

      <UsersTable items={users} />
    </>
  )
}
