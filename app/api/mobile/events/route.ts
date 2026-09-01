import { handleApiError, jsonOk } from "@/lib/api/http"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const { getEvents } = await import("@/services/content-service")
    return jsonOk({ items: await getEvents() })
  } catch (error) {
    return handleApiError(error, "mobile/events GET")
  }
}
