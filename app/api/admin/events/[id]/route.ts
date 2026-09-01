import { withAdmin } from "@/lib/api/admin-route"
import { parseAdminContentBody } from "@/lib/api/admin-content"
import { ApiError, jsonOk } from "@/lib/api/http"
import { eventInputSchema } from "@/lib/validation/admin"
import {
  deleteEvent,
  getEventDoc,
  updateEvent,
} from "@/services/admin/content-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Params = { params: Promise<{ id: string }> }

export async function GET(request: Request, { params }: Params) {
  return withAdmin(request, "admin/events/[id] GET", async () => {
    const item = await getEventDoc((await params).id)

    if (!item) {
      throw new ApiError(404, "not_found", "Evenimentul nu a fost găsit.")
    }

    return jsonOk({ item })
  })
}

export async function PATCH(request: Request, { params }: Params) {
  return withAdmin(request, "admin/events/[id] PATCH", async (admin) => {
    const body = await parseAdminContentBody(request, eventInputSchema)
    await updateEvent((await params).id, body.input, admin.uid, {
      file: body.file,
      removeImage: body.removeImage,
      keepExistingImage: body.multipart,
    })
    return jsonOk({ success: true })
  })
}

export async function DELETE(request: Request, { params }: Params) {
  return withAdmin(request, "admin/events/[id] DELETE", async (admin) => {
    await deleteEvent((await params).id, admin.uid)
    return jsonOk({ success: true })
  })
}
