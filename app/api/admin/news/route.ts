import { withAdmin } from "@/lib/api/admin-route"
import { parseAdminContentBody } from "@/lib/api/admin-content"
import { jsonOk } from "@/lib/api/http"
import { newsInputSchema } from "@/lib/validation/admin"
import { createNews, listAllNews } from "@/services/admin/content-admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  return withAdmin(request, "admin/news GET", async () => {
    const limit = Number(new URL(request.url).searchParams.get("limit"))
    return jsonOk({ items: await listAllNews(limit || undefined) })
  })
}

export async function POST(request: Request) {
  return withAdmin(request, "admin/news POST", async (admin) => {
    const body = await parseAdminContentBody(request, newsInputSchema)
    const id = await createNews(body.input, admin.uid, {
      file: body.file,
      keepExistingImage: body.multipart,
    })
    return jsonOk({ id }, 201)
  })
}
