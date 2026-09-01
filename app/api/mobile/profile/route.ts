import { handleApiError, jsonOk } from "@/lib/api/http"
import { parseJsonBody, validate } from "@/lib/api/public-form"
import { requireUser } from "@/lib/auth/require-user"
import { mobileProfileSchema } from "@/lib/validation/mobile"
import {
  getMobileProfile,
  updateMobileProfile,
} from "@/services/mobile/profile"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const user = await requireUser(request)
    return jsonOk({ profile: await getMobileProfile(user.uid) })
  } catch (error) {
    return handleApiError(error, "mobile/profile GET")
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireUser(request)
    const input = validate(mobileProfileSchema, await parseJsonBody(request))
    return jsonOk({ profile: await updateMobileProfile(user, input) })
  } catch (error) {
    return handleApiError(error, "mobile/profile PATCH")
  }
}
