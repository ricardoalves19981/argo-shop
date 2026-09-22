// import { cookies } from "next/headers";
// import { notFound, redirect } from "next/navigation";
// import Link from "next/link";

// interface OrderDetail {
//   id: number;
//   orderNumber: string;
//   totalAmount: number;
//   status: string;
//   isPaid: boolean;
//   paymentDate?: string;
//   refId?: string;
//   createdAt: string;
//   recipientName: string;
//   phoneNumber: string;
//   address: string;
//   postalCode: string;
//   shippingTrackingCode?: string;
//   items: {
//     productId: number;
//     productName: string;
//     unitPrice: number;
//     quantity: number;
//     totalPrice: number;
//   }[];
// }

// async function getOrderDetails(orderNumber: string): Promise<OrderDetail> {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("agro-token")?.value;

//   if (!token) {
//     redirect(`/auth/login?returnUrl=/orders/${orderNumber}`);
//   }

//   // استفاده از متغیر محیطی صحیح با مقدار پیش‌فرض پورت بک‌اند
//   const baseUrl =
//     process.env.API_BASE_URL ||
//     process.env.NEXT_PUBLIC_API_URL ||
//     "http://localhost:5079";

//   const targetUrl = `${baseUrl}/api/orders/my-orders/${orderNumber}`;

//   // برای دیباگ در ترمینال سرور:
//   console.log("Fetching order from:", targetUrl);

//   const res = await fetch(targetUrl, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     cache: "no-store",
//   });

//   if (res.status === 404) {
//     console.error(`Order not found on backend: ${targetUrl}`);
//     notFound();
//   }

//   if (res.status === 401) {
//     redirect(`/auth/login?returnUrl=/orders/${orderNumber}`);
//   }

//   if (!res.ok) {
//     throw new Error(`خطا در دریافت اطلاعات سفارش (کد: ${res.status})`);
//   }

//   return res.json();
// }

// export default async function OrderDetailPage({
//   params,
// }: {
//   params: Promise<{ orderNumber: string }>;
// }) {
//   const { orderNumber } = await params;
//   const order = await getOrderDetails(orderNumber);

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8" dir="rtl">
//       {/* هدر صفحه */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">
//             سفارش #{order.orderNumber}
//           </h1>
//           <p className="text-xs text-gray-500 mt-1">
//             ثبت شده در {new Date(order.createdAt).toLocaleDateString("fa-IR")}
//           </p>
//         </div>
//         <Link
//           href="/orders"
//           className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
//         >
//           بازگشت به سفارش‌ها &larr;
//         </Link>
//       </div>

//       {/* اطلاعات پرداخت و آدرس */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
//         <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
//           <h2 className="font-semibold text-gray-800 text-sm border-b pb-2">
//             اطلاعات پرداخت
//           </h2>
//           <div className="text-xs space-y-2.5">
//             <div className="flex justify-between">
//               <span className="text-gray-500">وضعیت پرداخت:</span>
//               <span
//                 className={
//                   order.isPaid
//                     ? "text-emerald-600 font-bold"
//                     : "text-amber-600 font-bold"
//                 }
//               >
//                 {order.isPaid ? "موفق" : "ناموفق / در انتظار"}
//               </span>
//             </div>
//             {order.refId && (
//               <div className="flex justify-between">
//                 <span className="text-gray-500">کد پیگیری زرین‌پال:</span>
//                 <span className="font-mono text-gray-700 font-bold">
//                   {order.refId}
//                 </span>
//               </div>
//             )}
//             {order.shippingTrackingCode && (
//               <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-100">
//                 <span className="text-purple-700 block mb-1">
//                   کد رهگیری مرسوله:
//                 </span>
//                 <span className="font-mono font-bold text-purple-900 text-sm block select-all">
//                   {order.shippingTrackingCode}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 md:col-span-2">
//           <h2 className="font-semibold text-gray-800 text-sm border-b pb-2">
//             مشخصات گیرنده و نشانی
//           </h2>
//           <div className="text-xs space-y-2 text-gray-600">
//             <p>
//               <span className="text-gray-400">نام تحویل‌گیرنده:</span>{" "}
//               {order.recipientName}
//             </p>
//             <p>
//               <span className="text-gray-400">شماره تماس:</span>{" "}
//               {order.phoneNumber}
//             </p>
//             <p>
//               <span className="text-gray-400">کد پستی:</span> {order.postalCode}
//             </p>
//             <p>
//               <span className="text-gray-400">نشانی کامل:</span> {order.address}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* جدول اقلام */}
//       <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
//         <div className="p-4 border-b bg-gray-50/50">
//           <h2 className="font-semibold text-sm text-gray-800">
//             اقلام خریداری شده
//           </h2>
//         </div>
//         <table className="w-full text-right text-sm">
//           <thead className="text-xs text-gray-500 border-b">
//             <tr>
//               <th className="p-4">شرح محصول</th>
//               <th className="p-4 text-center">تعداد</th>
//               <th className="p-4 text-left">قیمت واحد (تومان)</th>
//               <th className="p-4 text-left">جمع ردیف (تومان)</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-100 text-gray-700">
//             {order.items?.map((item) => (
//               <tr key={item.productId}>
//                 <td className="p-4 font-medium text-gray-900">
//                   {item.productName}
//                 </td>
//                 <td className="p-4 text-center">{item.quantity}</td>
//                 <td className="p-4 text-left">
//                   {item.unitPrice.toLocaleString("fa-IR")}
//                 </td>
//                 <td className="p-4 text-left font-semibold text-gray-900">
//                   {item.totalPrice.toLocaleString("fa-IR")}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//           <tfoot className="bg-gray-50/75 border-t">
//             <tr>
//               <td colSpan={3} className="p-4 text-left font-bold text-gray-700">
//                 مجموع کل:
//               </td>
//               <td className="p-4 text-left font-extrabold text-emerald-600 text-base">
//                 {order.totalAmount.toLocaleString("fa-IR")} تومان
//               </td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>
//     </div>
//   );
// }
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

interface OrderItem {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
}

interface OrderDetail {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  isPaid: boolean;
  paymentDate?: string;
  refId?: string;
  createdAt: string;
  recipientName: string;
  phoneNumber: string;
  address: string;
  postalCode: string;
  shippingTrackingCode?: string;
  items: OrderItem[];
}

async function getOrderDetails(orderNumber: string): Promise<OrderDetail> {
  const cookieStore = await cookies();
  const token = cookieStore.get("agro-token")?.value;

  if (!token) {
    redirect(`/auth/login?returnUrl=/orders/${orderNumber}`);
  }

  // اولویت‌بندی برای آدرس بک‌اند ASP.NET Core
  const baseUrl =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5079";

  const targetUrl = `${baseUrl}/orders/my-orders/${orderNumber}`;

  const res = await fetch(targetUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 404) {
    notFound();
  }

  if (res.status === 401) {
    redirect(`/auth/login?returnUrl=/orders/${orderNumber}`);
  }

  if (!res.ok) {
    throw new Error(`خطا در دریافت اطلاعات سفارش (کد: ${res.status})`);
  }

  return res.json();
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await getOrderDetails(orderNumber);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8" dir="rtl">
      {/* هدر صفحه */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            سفارش #{order.orderNumber}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            ثبت شده در {new Date(order.createdAt).toLocaleDateString("fa-IR")}
          </p>
        </div>
        <Link
          href="/orders"
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
        >
          بازگشت به سفارش‌ها &larr;
        </Link>
      </div>

      {/* اطلاعات پرداخت و آدرس */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="font-semibold text-gray-800 text-sm border-b pb-2">
            اطلاعات پرداخت
          </h2>
          <div className="text-xs space-y-2.5">
            <div className="flex justify-between">
              <span className="text-gray-500">وضعیت پرداخت:</span>
              <span
                className={
                  order.isPaid
                    ? "text-emerald-600 font-bold"
                    : "text-amber-600 font-bold"
                }
              >
                {order.isPaid ? "موفق" : "ناموفق / در انتظار"}
              </span>
            </div>
            {order.refId && (
              <div className="flex justify-between">
                <span className="text-gray-500">کد پیگیری زرین‌پال:</span>
                <span className="font-mono text-gray-700 font-bold">
                  {order.refId}
                </span>
              </div>
            )}
            {order.shippingTrackingCode && (
              <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-100">
                <span className="text-purple-700 block mb-1">
                  کد رهگیری مرسوله:
                </span>
                <span className="font-mono font-bold text-purple-900 text-sm block select-all">
                  {order.shippingTrackingCode}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3 md:col-span-2">
          <h2 className="font-semibold text-gray-800 text-sm border-b pb-2">
            مشخصات گیرنده و نشانی
          </h2>
          <div className="text-xs space-y-2 text-gray-600">
            <p>
              <span className="text-gray-400">نام تحویل‌گیرنده:</span>{" "}
              {order.recipientName || "ثبت نشده"}
            </p>
            <p>
              <span className="text-gray-400">شماره تماس:</span>{" "}
              {order.phoneNumber || "ثبت نشده"}
            </p>
            <p>
              <span className="text-gray-400">کد پستی:</span>{" "}
              {order.postalCode || "ثبت نشده"}
            </p>
            <p>
              <span className="text-gray-400">نشانی کامل:</span>{" "}
              {order.address || "ثبت نشده"}
            </p>
          </div>
        </div>
      </div>

      {/* جدول اقلام */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-gray-50/50">
          <h2 className="font-semibold text-sm text-gray-800">
            اقلام خریداری شده
          </h2>
        </div>
        <table className="w-full text-right text-sm">
          <thead className="text-xs text-gray-500 border-b">
            <tr>
              <th className="p-4">شرح محصول</th>
              <th className="p-4 text-center">تعداد</th>
              <th className="p-4 text-left">قیمت واحد (تومان)</th>
              <th className="p-4 text-left">جمع ردیف (تومان)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {order.items?.map((item) => {
              const itemTotal = item.unitPrice * item.quantity;
              return (
                <tr key={item.productId}>
                  <td className="p-4 font-medium text-gray-900">
                    {item.productName}
                  </td>
                  <td className="p-4 text-center">{item.quantity}</td>
                  <td className="p-4 text-left">
                    {item.unitPrice.toLocaleString("fa-IR")}
                  </td>
                  <td className="p-4 text-left font-semibold text-gray-900">
                    {itemTotal.toLocaleString("fa-IR")}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot className="bg-gray-50/75 border-t">
            <tr>
              <td colSpan={3} className="p-4 text-left font-bold text-gray-700">
                مجموع کل:
              </td>
              <td className="p-4 text-left font-extrabold text-emerald-600 text-base">
                {order.totalAmount.toLocaleString("fa-IR")} تومان
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
