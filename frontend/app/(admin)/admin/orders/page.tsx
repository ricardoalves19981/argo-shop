"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import api from "@/lib/api";

interface Order {
  id: number;
  orderNumber?: string;
  customerName?: string;
  user?: {
    fullName?: string;
    userName?: string;
  };
  createdAt?: string;
  totalAmount?: number;
  status: string | number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // واکشی سفارشات با api (Axios)
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/orders");
      const data = res.data;

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data?.items)) {
        setOrders(data.items);
      } else if (Array.isArray(data?.data)) {
        setOrders(data.data);
      } else {
        setOrders([]);
      }
    } catch (err: any) {
      console.error("خطا در واکشی سفارشات:", err);
      setError(
        err.response?.data?.message || "خطا در دریافت لیست سفارش‌ها از سرور",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusBadge = (status: string | number) => {
    const normalized =
      typeof status === "string" ? status.trim().toLowerCase() : status;

    switch (normalized) {
      // 0: در انتظار پرداخت
      case 0:
      case "0":
      case "pending":
        return (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
            در انتظار پرداخت
          </span>
        );

      // 1: پرداخت شده / در حال پردازش
      case 1:
      case "1":
      case "paid":
      case "processing":
        return (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
            پرداخت شده
          </span>
        );

      // 2: ارسال شده
      case 2:
      case "2":
      case "shipped":
        return (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
            ارسال شده
          </span>
        );

      // 3: تحویل داده شده (موفق)
      case 3:
      case "3":
      case "delivered":
      case "completed":
        return (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            تحویل داده شده
          </span>
        );

      // 4: لغو شده
      case 4:
      case "4":
      case "cancelled":
      case "canceled":
        return (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
            لغو شده
          </span>
        );

      default:
        return (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {status !== null && status !== undefined
              ? String(status)
              : "نامشخص"}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">مدیریت سفارش‌ها</h1>
      </div>

      {/* نمایش خطا در صورت بروز مشکل */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">شماره سفارش</TableHead>
              <TableHead className="text-right">مشتری</TableHead>
              <TableHead className="text-right">تاریخ</TableHead>
              <TableHead className="text-right">مبلغ کل (تومان)</TableHead>
              <TableHead className="text-right">وضعیت</TableHead>
              <TableHead className="text-left">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  <div className="flex justify-center items-center gap-2 text-gray-500 text-sm">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    در حال دریافت سفارش‌ها...
                  </div>
                </TableCell>
              </TableRow>
            ) : orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono">
                    {order.orderNumber || `#${order.id}`}
                  </TableCell>
                  <TableCell>
                    {order.customerName ||
                      order.user?.fullName ||
                      order.user?.userName ||
                      "—"}
                  </TableCell>
                  <TableCell>
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("fa-IR")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {order.totalAmount != null
                      ? Number(order.totalAmount).toLocaleString("fa-IR")
                      : "۰"}
                  </TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-left">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/orders/${order.id}`}>جزئیات</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-muted-foreground text-sm"
                >
                  هیچ سفارشی ثبت نشده است.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
