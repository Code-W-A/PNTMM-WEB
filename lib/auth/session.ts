import "server-only"

import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/constants"
import { getAdminAuth } from "@/lib/firebase/admin"

export { SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS }

export function sessionCookieOptions() {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  }
}

export async function createSessionCookie(idToken: string): Promise<string> {
  return getAdminAuth().createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE_SECONDS * 1000,
  })
}

/** Verifică inclusiv revocarea sesiunii, nu doar semnătura. */
export async function verifySessionCookie(cookie: string) {
  return getAdminAuth().verifySessionCookie(cookie, true)
}
