import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('agro_token')?.value;
  const role = request.cookies.get('agro_role')?.value;
  const { pathname } = request.nextUrl;

  // ۱. بررسی دسترسی به پنل مدیریت (Admin)
  if (pathname.startsWith('/admin')) {
    if (!token) {
      // کاربر مهمان است؛ ارسال به صفحه ورود
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role !== 'Admin') {
      // کاربر لاگین کرده اما ادمین نیست؛ هدایت به صفحه اصلی یا پنل کاربری
      return NextResponse.redirect(new URL('/user', request.url));
    }
  }

  // ۲. بررسی دسترسی به پنل کاربری یا صفحه تسویه حساب (Checkout)
  if (pathname.startsWith('/user') || pathname.startsWith('/checkout')) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ۳. اگر کاربر قبلا لاگین کرده و می‌خواهد دوباره صفحه لاگین/ثبت‌نام را باز کند
  if (pathname === '/login' || pathname === '/register') {
    if (token) {
      if (role === 'Admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/user', request.url));
    }
  }

  return NextResponse.next();
}

// تعیین مسیرهایی که باید توسط Middleware فیلتر شوند
export const config = {
  matcher: ['/admin/:path*', '/user/:path*', '/checkout/:path*', '/login', '/register'],
};
