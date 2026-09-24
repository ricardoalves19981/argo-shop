// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server"; // 👈 از next/server ایمپورت شود

export function middleware(request: NextRequest) {
  const token = request.cookies.get("agro_token")?.value;
  const role = request.cookies.get("agro_role")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isAdminPage = pathname.startsWith("/admin");

  // ۱. اگر توکن ندارد و می‌خواهد به داشبورد یا پنل ادمین برود
  if (!token && (isDashboardPage || isAdminPage)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ۲. اگر کاربر ادمین نیست و می‌خواهد به ادمین برود
  if (isAdminPage && role !== "Admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ۳. اگر کاربر لاگین است و صفحه ورود را باز می‌کند (مگر اینکه دکمه خروج را زده باشد)
  if (token && isAuthPage && !request.nextUrl.searchParams.has("logout")) {
    if (role === "Admin") {
      return NextResponse.redirect(new URL("/admin/products", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
