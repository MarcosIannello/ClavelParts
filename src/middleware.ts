import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "clavelparts_auth";

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtectedRoute =
    pathname.startsWith("/mi-garage") ||
    pathname.startsWith("/carrito") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/admin");

  if (!isProtectedRoute) return NextResponse.next();

  const isAuthenticated = request.cookies.get(AUTH_COOKIE_NAME)?.value === "1";

  if (isAuthenticated) return NextResponse.next();

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/mi-garage/:path*", "/carrito/:path*", "/checkout/:path*", "/admin/:path*"],
};
