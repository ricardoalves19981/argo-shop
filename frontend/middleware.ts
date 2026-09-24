// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("agro_token")?.value;
  const role = request.cookies.get("agro_role")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isAdminPage = pathname.startsWith("/admin");

  // تبدیل نقش به حروف کوچک برای مقایسه مطمئن
  const isAdmin = role?.toLowerCase() === "admin";

  // ۱. کاربر لاگین نکرده است
  if (!token && (isDashboardPage || isAdminPage)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ۲. کاربر لاگین کرده ولی دسترسی ادمین ندارد و می‌خواهد به پنل ادمین برود
  if (isAdminPage && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ۳. کاربر لاگین کرده و صفحه ورود یا ثبت‌نام را باز کرده است
  if (token && isAuthPage && !request.nextUrl.searchParams.has("logout")) {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin/products", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
