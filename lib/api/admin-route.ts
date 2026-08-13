import "server-only"

import { handleApiError } from "@/lib/api/http"
import { requireAdmin, type AdminContext } from "@/lib/auth/require-admin"

/**
 * Traseul comun al endpoint-urilor administrative: autorizarea se face înainte
 * de orice operațiune, iar erorile sunt convertite în răspunsuri sigure.
 * Ascunderea unui link în interfață nu constituie protecție.
 */
export async function withAdmin(
  request: Request,
  context: string,
  handler: (admin: AdminContext) => Promise<Response>,
): Promise<Response> {
  try {
    const admin = await requireAdmin(request)
    return await handler(admin)
  } catch (error) {
    return handleApiError(error, context)
  }
}
