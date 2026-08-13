import { withAdmin } from "@/lib/api/admin-route"
import { jsonOk } from "@/lib/api/http"
import { parseJsonBody, validate } from "@/lib/api/public-form"
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
    const input = validate(newsInputSchema, await parseJsonBody(request))
    const id = await createNews(input, admin.uid)
    return jsonOk({ id }, 201)
  })
}
