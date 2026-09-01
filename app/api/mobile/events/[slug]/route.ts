import { ApiError, handleApiError, jsonOk } from "@/lib/api/http"
import { getEventBySlug } from "@/services/content-service"

export const dynamic = "force-dynamic"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const item = await getEventBySlug((await params).slug)
    if (!item) {
      throw new ApiError(404, "not_found", "Evenimentul nu a fost găsit.")
    }
    return jsonOk({ item })
  } catch (error) {
    return handleApiError(error, "mobile/events/[slug] GET")
  }
}
