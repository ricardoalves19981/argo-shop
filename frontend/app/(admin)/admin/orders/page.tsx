import { cookies } from "next/headers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getOrders() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("agro_token")?.value;
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${apiUrl}/orders`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("خطا در پاسخ سفارشات:", res.status);
      return [];
    }

    const data = await res.json();
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.data)) return data.data;

    return [];
  } catch (error) {
    console.error("خطا در واکشی سفارشات:", error);
    return [];
  }
}

// ⚠️ حتماً باید export default باشد
export default async function AdminOrdersPage() {
  const orders = await getOrders();

  const getStatusBadge = (status: string | number) => {
    switch (status) {
      case "Completed":
      case 2:
        return (
          <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
            تکمیل شده
          </span>
        );
      case "Pending":
      case 0:
        return (
          <span className="text-xs px-2 py-1 rounded bg-yellow-100 text-yellow-700">
            در انتظار
          </span>
        );
      case "Processing":
      case 1:
        return (
          <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
            در حال پردازش
          </span>
        );
      case "Cancelled":
      case 3:
        return (
          <span className="text-xs px-2 py-1 rounded bg-red-100 text-red-700">
            لغو شده
          </span>
        );
      default:
        return (
          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">
            {status ?? "نامشخص"}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">مدیریت سفارش‌ها</h1>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>شماره سفارش</TableHead>
              <TableHead>مشتری</TableHead>
              <TableHead>تاریخ</TableHead>
              <TableHead>مبلغ کل (تومان)</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead className="text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length > 0 ? (
              orders.map((order: any) => (
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
                  <TableCell className="text-right">
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
                  className="text-center py-8 text-muted-foreground"
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
