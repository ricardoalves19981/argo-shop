// components/admin/order-status-selector.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface OrderStatusSelectorProps {
  orderId: number | string;
  currentStatus: number | string;
}

const STATUS_OPTIONS = [
  { id: 0, key: "Pending", label: "در انتظار پرداخت / تایید" },
  { id: 1, key: "Processing", label: "در حال پردازش / آماده‌سازی" },
  { id: 2, key: "Shipped", label: "ارسال شده" },
  { id: 3, key: "Completed", label: "تکمیل شده / تحویل داده شده" },
  { id: 4, key: "Cancelled", label: "لغو شده" },
];

export function OrderStatusSelector({
  orderId,
  currentStatus,
}: OrderStatusSelectorProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleUpdate = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const apiUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

      const res = await fetch(`${apiUrl}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // برای ارسال کوکی agro_token به بک‌اند
        credentials: "include",
        body: JSON.stringify({ status: Number(status) }),
      });

      if (!res.ok) {
        throw new Error("خطا در بروزرسانی وضعیت");
      }

      setMessage({ type: "success", text: "وضعیت سفارش با موفقیت تغییر کرد." });
      router.refresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "خطایی رخ داد" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border rounded-lg p-5 space-y-4 shadow-sm">
      <h3 className="font-semibold text-base">تغییر وضعیت سفارش</h3>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="flex h-10 w-full sm:w-64 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          {STATUS_OPTIONS.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>

        <Button onClick={handleUpdate} disabled={loading}>
          {loading ? "در حال ثبت..." : "ذخیره تغییرات"}
        </Button>
      </div>

      {message && (
        <p
          className={`text-sm ${
            message.type === "success" ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
