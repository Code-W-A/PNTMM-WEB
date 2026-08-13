import { withAdmin } from "@/lib/api/admin-route"
import { jsonOk } from "@/lib/api/http"
import { listUsers } from "@/services/admin/users-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  return withAdmin(request, "admin/users GET", async () => {
    const search = new URL(request.url).searchParams.get("search") ?? undefined
    return jsonOk({ items: await listUsers(200, search) })
  })
}
