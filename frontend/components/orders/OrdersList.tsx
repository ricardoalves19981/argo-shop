type OrderItemDto = {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
};

type OrderDto = {
  id: number;
  createdAt: string; // ISO
  status: string; // مثلا Pending/Paid/Shipped/Cancelled
  totalAmount?: number; // اگر داری
  items: OrderItemDto[];
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value) + " تومان";
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

function statusBadge(status: string) {
  const s = status.toLowerCase();

  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";

  if (s.includes("paid"))
    return (
      <span className={`${base} bg-emerald-50 text-emerald-700`}>
        پرداخت‌شده
      </span>
    );
  if (s.includes("ship") || s.includes("send"))
    return (
      <span className={`${base} bg-blue-50 text-blue-700`}>در حال ارسال</span>
    );
  if (s.includes("cancel"))
    return <span className={`${base} bg-rose-50 text-rose-700`}>لغو شده</span>;

  return <span className={`${base} bg-gray-100 text-gray-700`}>در انتظار</span>;
}

export default function OrdersList({ orders }: { orders: OrderDto[] }) {
  if (!orders?.length) {
    return (
      <div className="rounded-2xl border border-dashed bg-white p-10 text-center">
        <div className="text-lg font-bold text-gray-800">
          هنوز سفارشی ثبت نکرده‌اید
        </div>
        <div className="mt-2 text-sm text-gray-500">
          از صفحه محصولات خرید کنید تا سفارش‌ها اینجا نمایش داده شوند.
        </div>
        <a
          href="/products"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          رفتن به محصولات
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o.id} className="rounded-2xl border bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm text-gray-500">شماره سفارش</div>
              <div className="text-lg font-black text-gray-900">#{o.id}</div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {statusBadge(o.status)}
              <div className="text-sm text-gray-500">
                {formatDate(o.createdAt)}
              </div>

              {typeof o.totalAmount === "number" && (
                <div className="rounded-xl bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-800">
                  {formatPrice(o.totalAmount)}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-4 py-3 text-right font-semibold">محصول</th>
                  <th className="px-4 py-3 text-right font-semibold">تعداد</th>
                  <th className="px-4 py-3 text-right font-semibold">
                    قیمت واحد
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">جمع</th>
                </tr>
              </thead>
              <tbody>
                {o.items?.map((it) => (
                  <tr key={it.id} className="border-t">
                    <td className="px-4 py-3 font-medium text-gray-800">
                      {it.productName}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{it.quantity}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatPrice(it.unitPrice)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      {formatPrice(it.unitPrice * it.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
