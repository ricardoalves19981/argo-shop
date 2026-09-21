// src/app/checkout/success/page.tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const orderId = searchParams.get("orderId");

  return (
    <div className="container mx-auto max-w-lg px-4 py-20 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-black text-gray-900">
        سفارش شما با موفقیت ثبت شد!
      </h1>
      <p className="mt-2 text-sm text-gray-600">کد رهگیری و شماره سفارش شما:</p>

      <div className="my-4 inline-block rounded-xl bg-gray-100 px-6 py-2.5 font-mono text-lg font-bold text-emerald-800 tracking-wider">
        {orderNumber || "---"}
      </div>

      <p className="text-xs text-gray-500 leading-relaxed">
        سفارش شما جهت بسته‌بندی و ارسال به انبار تحویل داده شد. وضعیت سفارش را
        می‌توانید از بخش پروفایل پیگیری کنید.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/"
          className="rounded-xl border border-gray-200 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
        >
          بازگشت به فروشگاه
        </Link>
        <Link
          href="/profile/orders"
          className="rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition"
        >
          مشاهده سفارش‌های من
        </Link>
      </div>
    </div>
  );
}
