import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// تابع کمکی برای استخراج نقش از JWT بدون نیاز به پکیج خارجی
function extractRoleFromToken(token: string): string | null {
  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return null;
    
    // تبدیل Base64Url به Base64 معمولی
    const normalized = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(normalized, "base64").toString("utf-8");
    const parsed = JSON.parse(jsonPayload);

    // Identity معمولاً نقش را در یکی از این سه فیلد قرار می‌دهد:
    return (
      parsed["role"] ||
      parsed["roles"] ||
      parsed["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
      null
    );
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("agro_token")?.value;
  let role = request.cookies.get("agro_role")?.value;

  // اگر کوکی نقش نبود یا نامعتبر بود، مستقیم از داخل توکن استخراج کن
  if (token && (!role || role === "undefined")) {
    role = extractRoleFromToken(token) || undefined;
  }

  const { pathname } = request.nextUrl;

  // ۱. محافظت از مسیرهای ادمین
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // اگر نقش Admin نبود به پنل کاربر بفرست
    if (role !== "Admin") {
      return NextResponse.redirect(new URL("/user", request.url));
    }
  }

  // ۲. محافظت از مسیرهای کاربر عادی
  if (pathname.startsWith("/user") || pathname.startsWith("/checkout")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ۳. اگر لاگین است و می‌خواهد به لاگین یا ثبت‌نام برود
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      return role === "Admin"
        ? NextResponse.redirect(new URL("/admin", request.url))
        : NextResponse.redirect(new URL("/user", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*", "/checkout/:path*", "/login", "/register"],
};
