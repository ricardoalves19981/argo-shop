// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// تابع کمکی برای دیکود کردن امن پی‌لود JWT در محیط Edge میدل‌ور
function parseJwtPayload(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    // دیکود کردن بخش Payload (Base64Url)
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  // ۱. خواندن توکن اصلی
  const token = request.cookies.get("agro_token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isAdminPage = pathname.startsWith("/admin");

  // ۲. استخراج اطلاعات و نقش از درون پی‌لود توکن معتبر
  let isAdmin = false;
  let isTokenExpired = false;

  if (token) {
    const payload = parseJwtPayload(token);
    if (payload) {
      // بررسی انقضای توکن (در صورتی که کلیم exp وجود دارد)
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        isTokenExpired = true;
      } else {
        // نام کلیم نقش در دات‌نت معمولاً یکی از این دو مورد است:
        const userRole =
          payload.role ||
          payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        if (Array.isArray(userRole)) {
          isAdmin = userRole.some((r) => String(r).toLowerCase() === "admin");
        } else if (typeof userRole === "string") {
          isAdmin = userRole.toLowerCase() === "admin";
        }
      }
    } else {
      isTokenExpired = true;
    }
  }

  const isAuthenticated = Boolean(token && !isTokenExpired);

  // ۱. کاربر لاگین نکرده است یا توکن منقضی شده
  if (!isAuthenticated && (isDashboardPage || isAdminPage)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("returnUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ۲. کاربر لاگین کرده ولی دسترسی ادمین ندارد و می‌خواهد به پنل ادمین برود
  if (isAdminPage && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // ۳. کاربر لاگین کرده و وارد صفحات لاگین/ثبت‌نام شده است
  if (isAuthenticated && isAuthPage && !request.nextUrl.searchParams.has("logout")) {
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
