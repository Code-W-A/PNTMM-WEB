import { withAdmin } from "@/lib/api/admin-route"
import { jsonOk } from "@/lib/api/http"
import { parseJsonBody, validate } from "@/lib/api/public-form"
import { notificationInputSchema } from "@/lib/validation/admin"
import { sendGeneralNotification } from "@/services/admin/notifications-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  return withAdmin(request, "admin/notifications POST", async (admin) => {
    const input = validate(
      notificationInputSchema,
      await parseJsonBody(request),
    )

    const result = await sendGeneralNotification(input, admin.uid)

    return jsonOk(result, 201)
  })
}
