import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

import { SESSION_COOKIE, verifyToken } from "@/lib/session-crypto"

export async function proxy(request: NextRequest) {
  const secret = process.env.SESSION_SECRET
  const token = request.cookies.get(SESSION_COOKIE)?.value
  const authenticated = secret ? await verifyToken(token, secret) : false
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/dashboard") && !authenticated) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname === "/login" && authenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
