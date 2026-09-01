import { handleApiError, jsonOk } from "@/lib/api/http"
import { getEvents } from "@/services/content-service"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    return jsonOk({ items: await getEvents() })
  } catch (error) {
    return handleApiError(error, "mobile/events GET")
  }
}
