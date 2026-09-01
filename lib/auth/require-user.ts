import "server-only"

import type { DecodedIdToken } from "firebase-admin/auth"

import { ApiError } from "@/lib/api/http"
import { getAdminAuth } from "@/lib/firebase/admin-auth"
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin"

export interface UserContext {
  uid: string
  email?: string
  name?: string
}

function toUserContext(token: DecodedIdToken): UserContext {
  return {
    uid: token.uid,
    email: token.email,
    name: typeof token.name === "string" ? token.name : undefined,
  }
}

export function bearerToken(request: Request): string | null {
  const authorization = request.headers.get("authorization")
  if (!authorization?.toLowerCase().startsWith("bearer ")) return null

  const token = authorization.slice(7).trim()
  return token || null
}

/** Verifică o sesiune Firebase mobilă, inclusiv revocarea tokenului. */
export async function requireUser(request: Request): Promise<UserContext> {
  if (!isFirebaseAdminConfigured()) {
    throw new ApiError(
      503,
      "backend_unavailable",
      "Serviciul nu este disponibil momentan.",
    )
  }

  const token = bearerToken(request)
  if (!token) {
    throw new ApiError(401, "unauthenticated", "Autentificare necesară.")
  }

  try {
    return toUserContext(await getAdminAuth().verifyIdToken(token, true))
  } catch {
    throw new ApiError(401, "unauthenticated", "Sesiunea a expirat.")
  }
}

/**
 * Formularele website rămân publice. Dacă este trimis totuși un Bearer token,
 * acesta trebuie să fie valid; o identitate invalidă nu este tratată anonim.
 */
export async function getOptionalUser(
  request: Request,
): Promise<UserContext | null> {
  return bearerToken(request) ? requireUser(request) : null
}
