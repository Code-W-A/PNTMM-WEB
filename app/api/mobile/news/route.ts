import { handleApiError, jsonError, jsonOk } from "@/lib/api/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const { getNews } = await import("@/services/content-service")
    return jsonOk({ items: await getNews() })
  } catch (error) {
    const handled = handleApiError(error, "mobile/news GET")
    if (error instanceof Error) {
      return jsonError(500, "internal_error", error.message)
    }
    return handled
  }
}
