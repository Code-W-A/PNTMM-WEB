import { handleApiError, jsonOk } from "@/lib/api/http"
import { getNews } from "@/services/content-service"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    return jsonOk({ items: await getNews() })
  } catch (error) {
    return handleApiError(error, "mobile/news GET")
  }
}
