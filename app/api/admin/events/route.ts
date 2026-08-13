import { withAdmin } from "@/lib/api/admin-route"
import { jsonOk } from "@/lib/api/http"
import { parseJsonBody, validate } from "@/lib/api/public-form"
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
    const input = validate(eventInputSchema, await parseJsonBody(request))
    const id = await createEvent(input, admin.uid)
    return jsonOk({ id }, 201)
  })
}
