import { withAdmin } from "@/lib/api/admin-route"
import { jsonOk } from "@/lib/api/http"
import { parseJsonBody, validate } from "@/lib/api/public-form"
import { userStatusSchema } from "@/lib/validation/admin"
import { setUserStatus } from "@/services/admin/users-admin"
import type { UserStatus } from "@/types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ uid: string }> },
) {
  return withAdmin(request, "admin/users/[uid] PATCH", async (admin) => {
    const { status } = validate(userStatusSchema, await parseJsonBody(request))
    await setUserStatus((await params).uid, status as UserStatus, admin.uid)
    return jsonOk({ success: true })
  })
}
