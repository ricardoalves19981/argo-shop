// components/admin/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "داشبورد", path: "/admin", icon: LayoutDashboard },
    { name: "محصولات", path: "/admin/products", icon: Package },
    { name: "دسته‌بندی و برندها", path: "/admin/categories", icon: FolderTree },
    { name: "سفارش‌ها", path: "/admin/orders", icon: ShoppingCart },
    { name: "کاربران", path: "/admin/users", icon: Users },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white border-l border-gray-100 p-4 flex flex-col justify-between">
      <div>
        {/* لوگو / عنوان پنل */}
        <div className="mb-6 px-3 py-2 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
            A
          </div>
          <span className="font-bold text-gray-800 text-base">
            مدیریت اگروشاپ
          </span>
        </div>

        {/* لیست منوها */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // بررسی اکتیو بودن منو
            const isActive =
              item.path === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(item.path);

            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-semibold shadow-xs"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-emerald-600" : "text-gray-400"}`}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* دکمه بازگشت / خروج به فروشگاه */}
      <div className="pt-4 border-t border-gray-100">
        <Link
          href="/"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="w-5 h-5 text-red-500" />
          <span>خروج به سایت</span>
        </Link>
      </div>
    </aside>
  );
}
