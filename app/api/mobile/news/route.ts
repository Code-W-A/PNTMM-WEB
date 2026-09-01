import { handleApiError, jsonOk } from "@/lib/api/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const { getNews } = await import("@/services/content-service")
    return jsonOk({ items: await getNews() })
  } catch (error) {
    return handleApiError(error, "mobile/news GET")
  }
}
