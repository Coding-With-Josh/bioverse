import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET || "nasa-bio-frontier-secret-key-change-in-production",
  })

  const { pathname } = request.nextUrl

  // Allow access to sign-in page
  if (pathname === "/sign-in") {
    return NextResponse.next()
  }

  // Protect dashboard and role-select routes
  if (pathname.startsWith("/dashboard") || pathname === "/role-select") {
    if (!token) {
      // Redirect to sign-in if not authenticated
      const signInUrl = new URL("/sign-in", request.url)
      signInUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(signInUrl)
    }

    // If user is authenticated but has no role, redirect to role selection
    if (pathname.startsWith("/dashboard") && !token.role) {
      return NextResponse.redirect(new URL("/role-select", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/role-select", "/sign-in"],
}
