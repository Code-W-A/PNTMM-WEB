import "server-only"

import { cookies } from "next/headers"
import type { DecodedIdToken } from "firebase-admin/auth"

import { ApiError } from "@/lib/api/http"
import { getAdminAuth, isFirebaseAdminConfigured } from "@/lib/firebase/admin"
import { SESSION_COOKIE_NAME, verifySessionCookie } from "@/lib/auth/session"

export interface AdminContext {
  uid: string
  email?: string
  /** Claim standard `name`, prezent când contul are displayName setat. */
  name?: string
}

export const ADMIN_ROLE = "admin"

export function hasAdminClaim(token: DecodedIdToken): boolean {
  return token.role === ADMIN_ROLE || token.admin === true
}

function toAdminContext(token: DecodedIdToken): AdminContext {
  if (!hasAdminClaim(token)) {
    throw new ApiError(
      403,
      "forbidden",
      "Contul nu are drepturi de administrare.",
    )
  }

  return {
    uid: token.uid,
    email: token.email,
    name: typeof token.name === "string" ? token.name : undefined,
  }
}

/**
 * Autorizare pentru zona administrativă. Acceptă două surse echivalente:
 * session cookie (panoul web) și `Authorization: Bearer <idToken>`
 * (viitoarele aplicații mobile). Ambele sunt verificate cu Admin SDK,
 * inclusiv pentru revocare.
 */
export async function requireAdmin(request?: Request): Promise<AdminContext> {
  if (!isFirebaseAdminConfigured()) {
    throw new ApiError(
      503,
      "backend_unavailable",
      "Serviciul nu este disponibil momentan.",
    )
  }

  const bearer = request?.headers.get("authorization")

  if (bearer?.toLowerCase().startsWith("bearer ")) {
    const idToken = bearer.slice(7).trim()

    try {
      const decoded = await getAdminAuth().verifyIdToken(idToken, true)
      return toAdminContext(decoded)
    } catch (error) {
      if (error instanceof ApiError) throw error
      throw new ApiError(401, "unauthenticated", "Autentificare necesară.")
    }
  }

  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionCookie) {
    throw new ApiError(401, "unauthenticated", "Autentificare necesară.")
  }

  try {
    const decoded = await verifySessionCookie(sessionCookie)
    return toAdminContext(decoded)
  } catch (error) {
    if (error instanceof ApiError) throw error
    throw new ApiError(401, "unauthenticated", "Sesiunea a expirat.")
  }
}

/**
 * Variantă fără excepții, pentru randarea paginilor admin.
 * Returnează null în loc să arunce, ca layout-ul să poată redirecta.
 */
export async function getAdminContext(): Promise<AdminContext | null> {
  try {
    return await requireAdmin()
  } catch {
    return null
  }
}
