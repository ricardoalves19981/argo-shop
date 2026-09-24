// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Building,
  User as UserIcon,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";

interface OverviewData {
  fullName?: string;
  farmOrStoreName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  createdAt?: string;
  totalOrders: number;
  totalSpent: number;
  recentOrders: Array<{
    id: string | number;
    createdAt: string;
    totalAmount: number;
    status: string;
  }>;
}

export default function UserDashboardPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOverview = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("http://localhost:5079/api/profile/overview", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("خطا در دریافت اطلاعات داشبورد از سرور.");
      }

      const resData = await res.json();
      setData(resData);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "برقراری ارتباط با سرور با خطا مواجه شد.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  // ۱. وضعیت لودینگ
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] gap-3">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-sm text-gray-500">
          در حال دریافت اطلاعات حساب کاربری...
        </p>
      </div>
    );
  }

  // ۲. وضعیت خطا
  if (error || !data) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center max-w-lg mx-auto my-8">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="font-bold text-rose-800 mb-1">
          خطا در بارگذاری اطلاعات
        </h3>
        <p className="text-xs text-rose-600 mb-4">
          {error || "اطلاعاتی یافت نشد."}
        </p>
        <button
          onClick={loadOverview}
          className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  // ۳. نمایش محتوای داشبورد با دسترسی امن
  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر خوش‌آمدگویی */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            سلام، {data?.fullName || "کاربر گرامی"} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
            {data?.farmOrStoreName && (
              <span className="flex items-center gap-1 text-emerald-700 font-medium">
                <Building className="w-4 h-4" />
                {data.farmOrStoreName}
              </span>
            )}
            {data?.city && (
              <span className="flex items-center gap-1 text-gray-400">
                <MapPin className="w-3.5 h-3.5" />
                {data.city}
              </span>
            )}
          </p>
        </div>

        <Link
          href="/dashboard/profile"
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-xl transition self-start md:self-auto"
        >
          <UserIcon className="w-4 h-4" />
          ویرایش اطلاعات و آدرس
        </Link>
      </div>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-medium">
              تعداد کل سفارش‌ها
            </span>
            <span className="text-2xl font-black text-gray-800">
              {(data?.totalOrders ?? 0).toLocaleString("fa-IR")}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-gray-400 block font-medium">
              مجموع خریدها
            </span>
            <span className="text-2xl font-black text-emerald-600">
              {(data?.totalSpent ?? 0).toLocaleString("fa-IR")}
              <span className="text-xs font-normal text-gray-500 mr-1.5">
                تومان
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* آخرین سفارش‌ها */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-800">سفارش‌های اخیر</h2>
          <Link
            href="/dashboard/orders"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
          >
            مشاهده همه
            <ArrowLeft className="w-3.5 h-3.5" />
          </Link>
        </div>

        {!data?.recentOrders || data.recentOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-xs">
            هنوز سفارشی ثبت نکرده‌اید.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.recentOrders.map((order) => (
              <div
                key={order.id}
                className="py-3.5 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-gray-800 block">
                    سفارش #{order.id}
                  </span>
                  <span className="text-gray-400 text-[11px]">
                    {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-700">
                    {order.totalAmount.toLocaleString("fa-IR")} تومان
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-700">
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
