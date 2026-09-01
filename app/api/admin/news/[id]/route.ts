import { withAdmin } from "@/lib/api/admin-route"
import { parseAdminContentBody } from "@/lib/api/admin-content"
import { ApiError, jsonOk } from "@/lib/api/http"
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
    const body = await parseAdminContentBody(request, newsInputSchema)
    await updateNews((await params).id, body.input, admin.uid, {
      file: body.file,
      removeImage: body.removeImage,
      keepExistingImage: body.multipart,
    })
    return jsonOk({ success: true })
  })
}

export async function DELETE(request: Request, { params }: Params) {
  return withAdmin(request, "admin/news/[id] DELETE", async (admin) => {
    await deleteNews((await params).id, admin.uid)
    return jsonOk({ success: true })
  })
}
