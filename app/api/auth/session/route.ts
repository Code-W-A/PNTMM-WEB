import { cookies } from "next/headers"
import { z } from "zod"

import { ApiError, handleApiError, jsonOk } from "@/lib/api/http"
import { hasAdminClaim } from "@/lib/auth/require-admin"
import {
  SESSION_COOKIE_NAME,
  createSessionCookie,
  sessionCookieOptions,
  verifySessionCookie,
} from "@/lib/auth/session"
import { getAdminAuth } from "@/lib/firebase/admin-auth"
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const bodySchema = z.object({
  idToken: z.string().min(20, "Token invalid."),
})

/** Schimbă un ID token Firebase pe un session cookie HttpOnly. */
export async function POST(request: Request) {
  try {
    if (!isFirebaseAdminConfigured()) {
      throw new ApiError(
        503,
        "backend_unavailable",
        "Autentificarea nu este disponibilă momentan.",
      )
    }

    const parsed = bodySchema.safeParse(await request.json())

    if (!parsed.success) {
      throw new ApiError(400, "invalid_request", "Cerere invalidă.")
    }

    let decoded
    try {
      decoded = await getAdminAuth().verifyIdToken(parsed.data.idToken, true)
    } catch {
      throw new ApiError(401, "unauthenticated", "Autentificare eșuată.")
    }

    if (!hasAdminClaim(decoded)) {
      throw new ApiError(
        403,
        "forbidden",
        "Contul nu are drepturi de administrare.",
      )
    }

    const sessionCookie = await createSessionCookie(parsed.data.idToken)
    const cookieStore = await cookies()
    cookieStore.set({ ...sessionCookieOptions(), value: sessionCookie })

    return jsonOk({ uid: decoded.uid, email: decoded.email ?? null })
  } catch (error) {
    return handleApiError(error, "auth/session POST")
  }
}

/** Închide sesiunea și revocă token-urile de refresh. */
export async function DELETE() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value

    if (sessionCookie && isFirebaseAdminConfigured()) {
      try {
        const decoded = await verifySessionCookie(sessionCookie)
        await getAdminAuth().revokeRefreshTokens(decoded.sub)
      } catch {
        // Sesiune deja invalidă: ștergerea cookie-ului este suficientă.
      }
    }

    cookieStore.set({ ...sessionCookieOptions(), value: "", maxAge: 0 })

    return jsonOk({ success: true })
  } catch (error) {
    return handleApiError(error, "auth/session DELETE")
  }
}
