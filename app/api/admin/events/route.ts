import { withAdmin } from "@/lib/api/admin-route"
import { parseAdminContentBody } from "@/lib/api/admin-content"
import { jsonOk } from "@/lib/api/http"
import { eventInputSchema } from "@/lib/validation/admin"
import { createEvent, listAllEvents } from "@/services/admin/content-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  return withAdmin(request, "admin/events GET", async () => {
    const limit = Number(new URL(request.url).searchParams.get("limit"))
    return jsonOk({ items: await listAllEvents(limit || undefined) })
  })
}

export async function POST(request: Request) {
  return withAdmin(request, "admin/events POST", async (admin) => {
    const body = await parseAdminContentBody(request, eventInputSchema)
    const id = await createEvent(body.input, admin.uid, {
      file: body.file,
      keepExistingImage: body.multipart,
    })
    return jsonOk({ id }, 201)
  })
}
