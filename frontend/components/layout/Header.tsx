'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { title: 'خانه', href: '/' },
  { title: 'سموم کشاورزی', href: '/products?category=pesticides' },
  { title: 'کودها', href: '/products?category=fertilizers' },
  { title: 'بذر و نهال', href: '/products?category=seeds' },
  { title: 'مقالات', href: '/blog' },
  { title: 'تماس با ما', href: '/contact' },
];

export default function Header() {
  const { user, loading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="text-2xl">🌱</span>
            <span className="text-lg font-bold text-green-700">آگروشاپ</span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-gray-700 transition-colors hover:text-green-700"
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="hidden max-w-xs flex-1 md:flex">
            <input
              type="search"
              placeholder="جستجوی محصول..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-green-700"
              aria-label="سبد خرید"
            >
              <span className="text-xl">🛒</span>
              <span className="absolute -left-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-[10px] text-white">
                0
              </span>
            </Link>

            {loading ? (
              <div className="h-8 w-20 animate-pulse rounded-lg bg-gray-100" />
            ) : user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((value) => !value)}
                  className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800 hover:bg-green-100"
                >
                  <span className="max-w-[90px] truncate">
                    {user.fullName || user.email}
                  </span>
                  <span aria-hidden="true">▾</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute left-0 mt-2 w-48 rounded-lg border border-gray-100 bg-white py-2 text-sm shadow-lg">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-50"
                    >
                      پنل کاربری
                    </Link>

                    <Link
                      href="/dashboard/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-50"
                    >
                      سفارش‌های من
                    </Link>

                    {user.role === 'Admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-green-700 hover:bg-gray-50"
                      >
                        پنل مدیریت
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={logout}
                      className="w-full px-4 py-2 text-right text-red-600 hover:bg-red-50"
                    >
                      خروج از حساب
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/login"
                  className="rounded-lg border border-green-600 px-3 py-2 text-sm text-green-700 hover:bg-green-50"
                >
                  ورود
                </Link>

                <Link
                  href="/register"
                  className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                >
                  ثبت‌نام
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="text-2xl text-gray-700 lg:hidden"
              aria-label="باز کردن منو"
              aria-expanded={menuOpen}
            >
              ☰
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="flex flex-col gap-1 border-t border-gray-100 py-3 lg:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {item.title}
              </Link>
            ))}

            {!loading && !user && (
              <div className="mt-2 flex gap-2 border-t border-gray-100 pt-3 sm:hidden">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-lg border border-green-600 px-3 py-2 text-center text-sm text-green-700"
                >
                  ورود
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-lg bg-green-600 px-3 py-2 text-center text-sm text-white"
                >
                  ثبت‌نام
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
