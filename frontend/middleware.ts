import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Prefer new cookie names, fallback to legacy ones
  const token =
    request.cookies.get("agro-token")?.value ??
    request.cookies.get("agro_token")?.value;

  const role =
    request.cookies.get("agro-role")?.value ??
    request.cookies.get("agro_role")?.value;

  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role !== "Admin") {
      return NextResponse.redirect(new URL("/user", request.url));
    }
  }

  if (pathname.startsWith("/user") || pathname.startsWith("/checkout")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      if (role === "Admin") return NextResponse.redirect(new URL("/admin", request.url));
      return NextResponse.redirect(new URL("/user", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/checkout/:path*", "/login", "/register"],
};
