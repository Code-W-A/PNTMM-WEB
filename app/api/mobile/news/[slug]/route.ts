import { ApiError, handleApiError, jsonOk } from "@/lib/api/http"
import { getNewsBySlug } from "@/services/content-service"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const item = await getNewsBySlug((await params).slug)
    if (!item) {
      throw new ApiError(404, "not_found", "Știrea nu a fost găsită.")
    }
    return jsonOk({ item })
  } catch (error) {
    return handleApiError(error, "mobile/news/[slug] GET")
  }
}
