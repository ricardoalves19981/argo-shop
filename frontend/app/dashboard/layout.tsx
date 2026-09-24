"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, LayoutDashboard, MapPin, LogOut } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "نمای کلی", icon: LayoutDashboard },
    { href: "/dashboard/orders", label: "سفارش‌های من", icon: Package },
    { href: "/dashboard/profile", label: "اطلاعات حساب و آدرس", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gray-50/60 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* سایدبار */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm sticky top-6 space-y-4">
              <div className="pb-4 border-b border-gray-100">
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                  پنل کشاورزان و خریداران
                </span>
                <h2 className="text-lg font-bold text-gray-800 mt-2">
                  میز کاربری
                </h2>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                        isActive
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* محتوای صفحه */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
