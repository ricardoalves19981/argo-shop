// src/app/payment/success/page.tsx
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext"; // 👈 ایمپورت useCart

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const refId = searchParams.get("refId");

  const { clearCart } = useCart();
  const hasClearedRef = useRef(false);

  useEffect(() => {
    // جلوگیری از اجرای دوبار متوالی در حالت StrictMode ری‌اکت
    if (!hasClearedRef.current) {
      hasClearedRef.current = true;
      clearCart(); // 👈 ارسال درخواست به /api/cart جهت حذف سبد در دیتابیس و خالی شدن استیت
    }
  }, [clearCart]);

  return (
    <div
      className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl shadow-lg text-center"
      dir="rtl"
    >
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        پرداخت با موفقیت انجام شد
      </h1>
      <p className="text-gray-500 mb-6 text-sm">
        سفارش شما با شماره{" "}
        <span className="font-bold text-gray-800">{orderId}</span> ثبت شد.
      </p>

      <div className="bg-gray-50 p-4 rounded-2xl mb-8 text-right">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-400">کد رهگیری بانکی:</span>
          <span className="font-mono font-bold text-gray-700">{refId}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/dashboard/orders"
          className="bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-emerald-700 transition"
        >
          سفارش‌های من
        </Link>
        <Link
          href="/"
          className="bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
        >
          بازگشت به سایت
        </Link>
      </div>
    </div>
  );
}
