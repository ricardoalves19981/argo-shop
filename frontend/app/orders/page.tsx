// app/orders/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

type OrderListDto = {
  orderNumber: string;
  createdAt: string;
  totalAmount: number;
  status: string;
};

const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:5079";

async function getOrders(token: string): Promise<OrderListDto[]> {
  const url = `${API_BASE_URL}/api/orders/my-orders`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `خطا در دریافت لیست سفارش‌ها (status=${res.status}) ${text ? `- ${text}` : ""}`,
    );
  }

  return res.json();
}

function formatPrice(amount: number) {
  return new Intl.NumberFormat("fa-IR").format(amount) + " تومان";
}

function formatDate(isoDate: string) {
  try {
    const d = new Date(isoDate);
    return new Intl.DateTimeFormat("fa-IR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return isoDate;
  }
}

function getStatusBadge(status: string) {
  const s = (status || "").toLowerCase();

  if (s.includes("paid") || s.includes("پرداخت") || s.includes("تکمیل")) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        {status}
      </span>
    );
  }

  if (s.includes("ship") || s.includes("send") || s.includes("ارسال")) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        {status}
      </span>
    );
  }

  if (s.includes("cancel") || s.includes("لغو")) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
        {status}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
      {status || "در انتظار"}
    </span>
  );
}

export default async function OrdersPage() {
  const store = await cookies();
  const token = store.get("agro-token")?.value;

  if (!token) {
    redirect("/login?redirect=/orders");
  }

  const orders = await getOrders(token);

  return (
    <main className="min-h-screen bg-slate-50/60 py-10" dir="rtl">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              سفارش‌های من
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              پیگیری، مشاهده فاکتور و وضعیت سفارش‌های ثبت‌شده
            </p>
          </div>
          <div className="text-xs font-medium text-slate-400">
            تعداد کل سفارش‌ها:{" "}
            {new Intl.NumberFormat("fa-IR").format(orders.length)}
          </div>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-800">
              هنوز سفارشی ثبت نکرده‌اید
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              محصولات مورد نیاز خود را به سبد خرید اضافه کنید و سفارش دهید.
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              مشاهده محصولات
            </Link>
          </div>
        ) : (
          /* Orders List */
          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o.orderNumber}
                className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm transition hover:border-emerald-300 hover:shadow-md sm:flex-row sm:items-center"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-base font-bold text-slate-900">
                      #{o.orderNumber}
                    </span>
                    {getStatusBadge(o.status)}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{formatDate(o.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 sm:border-0 sm:pt-0 sm:gap-6">
                  <div className="text-right sm:text-left">
                    <div className="text-xs text-slate-400">مبلغ نهایی</div>
                    <div className="text-base font-extrabold text-slate-900">
                      {formatPrice(o.totalAmount)}
                    </div>
                  </div>

                  <Link
                    href={`/orders/${o.orderNumber}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-emerald-600 hover:text-white hover:border-emerald-600"
                  >
                    <span>مشاهده جزئیات</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3.5 w-3.5 rotate-180"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
