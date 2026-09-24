// app/dashboard/orders/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  ArrowRight,
} from "lucide-react";

interface OrderItem {
  id: string | number;
  productTitle?: string;
  productName?: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
}

interface Order {
  id: string | number;
  createdAt: string;
  totalAmount: number;
  status: string;
  items?: OrderItem[];
  orderItems?: OrderItem[];
}

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("http://localhost:5079/api/profile/orders", {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("خطا در دریافت لیست سفارش‌ها.");
      }

      const data = await res.json();
      // پشتیبانی هم از حالت آرایه مستقیم و هم حالت صفحه‌بندی شده { items: [] }
      const orderList = Array.isArray(data) ? data : data.items || [];
      setOrders(orderList);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "امکان اتصال به سرور وجود ندارد.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "delivered":
      case "تحویل شده":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-3.5 h-3.5" />
            تحویل شده
          </span>
        );
      case "processing":
      case "در حال پردازش":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
            <Clock className="w-3.5 h-3.5" />
            در حال پردازش
          </span>
        );
      case "shipped":
      case "ارسال شده":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700">
            <Truck className="w-3.5 h-3.5" />
            ارسال شده
          </span>
        );
      case "cancelled":
      case "لغو شده":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700">
            <XCircle className="w-3.5 h-3.5" />
            لغو شده
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
            <Clock className="w-3.5 h-3.5" />
            {status || "در انتظار بررسی"}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[350px] gap-3">
        <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-sm text-gray-500">
          در حال بارگذاری لیست سفارش‌ها...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center max-w-lg mx-auto my-8">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="font-bold text-rose-800 mb-1">خطا در دریافت اطلاعات</h3>
        <p className="text-xs text-rose-600 mb-4">{error}</p>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-xl hover:bg-rose-700 transition"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* هدر صفحه */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">سفارش‌های من</h1>
            <p className="text-xs text-gray-500 mt-1">
              سوابق و وضعیت پیگیری خریدهای شما در سامانه
            </p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 px-3.5 py-2 rounded-xl transition"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به داشبورد
        </Link>
      </div>

      {/* لیست سفارش‌ها */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-700">
            هنوز هیچ سفارشی ثبت نشده است
          </h3>
          <p className="text-xs text-gray-400 mt-1 mb-6">
            محصولات مورد نیاز مزرعه یا فروشگاه خود را از کاتالوگ انتخاب و ثبت
            نمایید.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
          >
            مشاهده محصولات
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const items = order.items || order.orderItems || [];
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 transition hover:border-gray-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-gray-900 text-sm">
                      کد سفارش: #{order.id}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                {/* اقلام سفارش در صورت وجود */}
                {items.length > 0 && (
                  <div className="py-3.5 divide-y divide-gray-50 text-xs">
                    {items.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="py-2 flex items-center justify-between text-gray-600"
                      >
                        <span>
                          {item.productTitle ||
                            item.productName ||
                            "محصول خریداری‌شده"}{" "}
                          ×{" "}
                          <strong className="text-gray-900">
                            {item.quantity}
                          </strong>
                        </span>
                        <span className="font-medium text-gray-700">
                          {(item.unitPrice * item.quantity).toLocaleString(
                            "fa-IR",
                          )}{" "}
                          تومان
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-3.5 flex items-center justify-between text-sm">
                  <span className="text-xs text-gray-500 font-medium">
                    مبلغ قابل پرداخت:
                  </span>
                  <span className="font-black text-emerald-600">
                    {(order.totalAmount ?? 0).toLocaleString("fa-IR")}{" "}
                    <span className="text-xs font-normal text-gray-500">
                      تومان
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
