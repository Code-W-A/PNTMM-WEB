import { withAdmin } from "@/lib/api/admin-route"
import { ApiError, jsonOk } from "@/lib/api/http"
import { parseJsonBody, validate } from "@/lib/api/public-form"
import { newsInputSchema } from "@/lib/validation/admin"
import {
  deleteNews,
  getNewsDoc,
  updateNews,
} from "@/services/admin/content-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type Params = { params: Promise<{ id: string }> }

export async function GET(request: Request, { params }: Params) {
  return withAdmin(request, "admin/news/[id] GET", async () => {
    const item = await getNewsDoc((await params).id)

    if (!item) {
      throw new ApiError(404, "not_found", "Articolul nu a fost găsit.")
    }

    return jsonOk({ item })
  })
}

export async function PATCH(request: Request, { params }: Params) {
  return withAdmin(request, "admin/news/[id] PATCH", async (admin) => {
    const input = validate(newsInputSchema, await parseJsonBody(request))
    await updateNews((await params).id, input, admin.uid)
    return jsonOk({ success: true })
  })
}

export async function DELETE(request: Request, { params }: Params) {
  return withAdmin(request, "admin/news/[id] DELETE", async (admin) => {
    await deleteNews((await params).id, admin.uid)
    return jsonOk({ success: true })
  })
}
