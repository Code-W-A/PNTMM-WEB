import { handleApiError, jsonOk } from "@/lib/api/http"
import { requireUser } from "@/lib/auth/require-user"
import { getMobileEventRegistration } from "@/services/mobile/event-registrations"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  try {
    const user = await requireUser(request)
    const registration = await getMobileEventRegistration(
      (await params).eventId,
      user.uid,
    )
    return jsonOk({ registered: Boolean(registration), registration })
  } catch (error) {
    return handleApiError(error, "mobile/event-registration GET")
  }
}
