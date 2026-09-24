// app/(admin)/admin/orders/[id]/page.tsx
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowRight,
  Package,
  User,
  MapPin,
  Calendar,
  CreditCard,
} from "lucide-react";
import { OrderStatusSelector } from "@/components/admin/order-status-selector";

async function getOrderDetails(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("agro_token")?.value;
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5079/api";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${apiUrl}/orders/admin/${id}`, {
      headers,
      cache: "no-store",
    });
    console.log(res);
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`خطای دریافت سفارش: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.error("خطا در واکشی جزئیات سفارش:", error);
    return null;
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderDetails(id);

  if (!order) {
    notFound();
  }

  // آیتم‌های سفارش با در نظر گرفتن ساختارهای احتمالی DTO
  const items = order.items || order.orderItems || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* دکمه بازگشت و عنوان */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/orders">
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              سفارش شماره {order.orderNumber || `#${order.id}`}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              ثبت شده در تاریخ{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("fa-IR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* کامپوننت تغییر وضعیت */}
      <OrderStatusSelector
        orderId={order.id}
        currentStatus={order.status ?? 0}
      />

      {/* اطلاعات خریدار و سفارش */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* مشخصات مشتری */}
        <div className="border rounded-lg p-5 bg-card space-y-3">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <User className="h-5 w-5" />
            <h2>اطلاعات خریدار</h2>
          </div>
          <div className="text-sm space-y-1.5 text-muted-foreground">
            <p>
              <strong className="text-foreground">نام: </strong>
              {order.user?.fullName || order.customerName || "—"}
            </p>
            <p>
              <strong className="text-foreground">شماره تماس: </strong>
              <span className="font-mono">
                {order.user?.phoneNumber || order.phoneNumber || "—"}
              </span>
            </p>
            <p>
              <strong className="text-foreground">ایمیل: </strong>
              {order.user?.email || "—"}
            </p>
          </div>
        </div>

        {/* نشانی و تحویل */}
        <div className="border rounded-lg p-5 bg-card space-y-3">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <MapPin className="h-5 w-5" />
            <h2>اطلاعات ارسال</h2>
          </div>
          <div className="text-sm space-y-1.5 text-muted-foreground">
            <p>
              <strong className="text-foreground">آدرس: </strong>
              {order.shippingAddress || order.address || "آدرسی ثبت نشده است"}
            </p>
            <p>
              <strong className="text-foreground">کد پستی: </strong>
              <span className="font-mono">{order.postalCode || "—"}</span>
            </p>
          </div>
        </div>

        {/* خلاصه مالی */}
        <div className="border rounded-lg p-5 bg-card space-y-3">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <CreditCard className="h-5 w-5" />
            <h2>اطلاعات پرداخت</h2>
          </div>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">مبلغ اقلام:</span>
              <span>
                {Number(
                  order.subTotal || order.totalAmount || 0,
                ).toLocaleString("fa-IR")}{" "}
                تومان
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">هزینه ارسال:</span>
              <span>
                {Number(order.shippingFee || 0).toLocaleString("fa-IR")} تومان
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between font-bold text-base">
              <span>مبلغ نهایی:</span>
              <span className="text-primary">
                {Number(order.totalAmount || 0).toLocaleString("fa-IR")} تومان
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* اقلام خریداری شده */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <div className="p-4 border-b bg-muted/40 font-semibold flex items-center gap-2">
          <Package className="h-5 w-5" />
          <span>اقلام سفارش</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ردیف</TableHead>
              <TableHead>نام محصول</TableHead>
              <TableHead>قیمت واحد</TableHead>
              <TableHead>تعداد</TableHead>
              <TableHead className="text-right">قیمت کل</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              items.map((item: any, index: number) => {
                const price = Number(item.unitPrice || item.price || 0);
                const qty = Number(item.quantity || 1);
                return (
                  <TableRow key={item.id || index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">
                      {item.productName || item.product?.name || "محصول"}
                    </TableCell>
                    <TableCell>{price.toLocaleString("fa-IR")} تومان</TableCell>
                    <TableCell>{qty}</TableCell>
                    <TableCell className="text-right font-medium">
                      {(price * qty).toLocaleString("fa-IR")} تومان
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  هیچ محصولی در این سفارش ثبت نشده است.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
