import { NextResponse, type NextRequest } from "next/server"

import { SESSION_COOKIE_NAME } from "@/lib/auth/constants"

/**
 * Strat de UX pentru zona admin: redirectează vizitatorii fără sesiune spre
 * login. Middleware-ul rulează pe Edge și NU poate verifica tokenul cu Admin
 * SDK, deci nu constituie autorizare. Verificarea reală se face în layout-ul
 * admin și în fiecare endpoint prin `requireAdmin`.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  const hasSession = request.cookies.has(SESSION_COOKIE_NAME)

  if (!hasSession) {
    const loginUrl = new URL("/admin/login", request.url)
    if (pathname !== "/admin") {
      loginUrl.searchParams.set("redirect", pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
