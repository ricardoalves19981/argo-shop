// src/components/Navbar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  ShieldAlert,
  Package,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ShoppingCart,
  Sprout,
} from "lucide-react";

export default function Navbar() {
  const { totalCount } = useCart();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // بستن منوی دراپ‌داون با کلیک به خارج از آن
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // بررسی دسترسی ادمین (پشتیبانی از role تکی یا آرایه roles)
  const isAdmin =
    user?.role === "Admin" ||
    (Array.isArray(user?.role) && user.role.includes("Admin"));

  const handleLogout = async () => {
    setDropdownOpen(false);
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // رفرش سخت و هدایت مستقیم به صفحه ورود
      window.location.href = "/login?logout=true";
    }
  };

  return (
    <header
      className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-100 shadow-sm font-sans"
      dir="rtl"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* لوگو و منوی اصلی */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-black text-2xl text-emerald-600 hover:opacity-90 transition"
          >
            <Sprout className="w-7 h-7 text-emerald-600" />
            <span>اگروشاپ</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link
              href="/products"
              className="hover:text-emerald-600 transition"
            >
              محصولات و نهاده‌ها
            </Link>
            <Link href="/about" className="hover:text-emerald-600 transition">
              درباره ما
            </Link>
            <Link href="/contact" className="hover:text-emerald-600 transition">
              تماس با ما
            </Link>
          </nav>
        </div>

        {/* دکمه‌های اکشن */}
        <div className="flex items-center gap-3">
          {/* سبد خرید */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-xl text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 transition duration-150 flex items-center justify-center"
            title="سبد خرید"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-emerald-600 px-1 text-[11px] font-bold text-white shadow-sm ring-2 ring-white">
                {totalCount}
              </span>
            )}
          </Link>

          {/* حساب کاربری / ادمین / ورود */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-xl transition focus:outline-none"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                  {(user.fullName || user.email || "U")[0].toUpperCase()}
                </div>
                <span className="max-w-[120px] truncate text-xs sm:text-sm">
                  {user.fullName || user.email}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-gray-500 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* منوی دراپ‌داون هوشمند بر اساس نقش */}
              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 z-50 animate-in fade-in zoom-in-95 duration-100">
                  {/* اطلاعات مختصر بالای منو */}
                  <div className="px-3 py-2 border-b border-gray-100 text-xs">
                    <p className="font-semibold text-gray-800 truncate">
                      {user.fullName || "کاربر"}
                    </p>
                    <p className="text-gray-400 font-mono text-[11px] truncate">
                      {user.email || user.userName || ""}
                    </p>
                  </div>

                  {/* بخش ویژه ادمین */}
                  {isAdmin && (
                    <>
                      <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-purple-600 uppercase">
                        دسترسی مدیریت
                      </div>
                      <Link
                        href="/admin/products"
                        onClick={() => setDropdownOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-right text-xs font-semibold text-purple-700 hover:bg-purple-50 transition"
                      >
                        <ShieldAlert className="w-4 h-4 text-purple-600" />
                        پنل مدیریت ادمین
                      </Link>
                      <hr className="my-1 border-gray-100" />
                    </>
                  )}

                  {/* بخش‌های داشبورد کاربر */}
                  <Link
                    href="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-right text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    <LayoutDashboard className="w-4 h-4 text-gray-400" />
                    داشبورد کاربری
                  </Link>

                  <Link
                    href="/dashboard/orders"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-right text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    <Package className="w-4 h-4 text-gray-400" />
                    سفارش‌های من
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-right text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                  >
                    <UserIcon className="w-4 h-4 text-gray-400" />
                    اطلاعات حساب و آدرس
                  </Link>

                  <hr className="my-1 border-gray-100" />

                  {/* خروج */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-right text-xs font-semibold text-rose-600 hover:bg-rose-50 transition"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    خروج از حساب
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="text-xs sm:text-sm font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition shadow-sm"
            >
              ورود / ثبت‌نام
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
