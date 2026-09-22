import Link from "next/link";
import {
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  PlusCircle,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export const metadata = {
  title: "پیشخوان مدیریت | آگروشاپ",
  description: "داشبورد مدیریت فروشگاه ادوات و نهاده‌های کشاورزی آگروشاپ",
};

export default function AdminDashboardPage() {
  // آمارهای نمونه داشبورد (در فاز بعدی می‌توانید با fetch از API دریافت کنید)
  const stats = [
    {
      title: "کل سفارش‌ها",
      value: "۱۲۸",
      change: "+۱۲٪ این ماه",
      isPositive: true,
      icon: ShoppingCart,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40",
    },
    {
      title: "محصولات فعال",
      value: "۴۵",
      change: "۳ قلم کمبود موجودی",
      isPositive: false,
      icon: Package,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      title: "مشتریان ثبت‌شده",
      value: "۳۴۰",
      change: "+۱۸ نفر جدید",
      isPositive: true,
      icon: Users,
      color: "text-violet-600 bg-violet-50 dark:bg-violet-950/40",
    },
    {
      title: "فروش کل ماه",
      value: "۸۴,۵۰۰,۰۰۰ تومان",
      change: "+۲۳٪ رشد",
      isPositive: true,
      icon: TrendingUp,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-1092",
      customer: "محمد رضایی (مزرعه سبز)",
      items: "کود فسفات آمونیوم، سمپاش ۲۰ لیتری",
      amount: "۴,۲۰۰,۰۰۰ تومان",
      status: "تکمیل شده",
      statusType: "success",
      date: "امروز - ۱۰:۴۵",
    },
    {
      id: "ORD-1091",
      customer: "کشاورزی نمونه شیراز",
      items: "بذر گوجه متین (۲ قوطی)",
      amount: "۱,۸۵۰,۰۰۰ تومان",
      status: "در حال پردازش",
      statusType: "pending",
      date: "امروز - ۰۹:۱۵",
    },
    {
      id: "ORD-1090",
      customer: "علی کریمی",
      items: "نوار تیپ پلاک‌دار ۲۰۰ متری",
      amount: "۸۹۰,۰۰۰ تومان",
      status: "در انتظار پرداخت",
      statusType: "warning",
      date: "دیروز - ۱۸:۳۰",
    },
  ];

  return (
    <div className="space-y-8 p-6 md:p-8" dir="rtl">
      {/* هدر پیشخوان و دکمه‌های اقدام سریع */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white md:text-3xl">
            پیشخوان مدیریت آگروشاپ
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            خلاصه وضعیت فروش، موجودی انبار و فعالیت‌های اخیر فروشگاه
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            <PlusCircle className="h-4 w-4" />
            افزودن محصول جدید
          </Link>
          <Link
            href="/admin/products"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            مدیریت محصولات
          </Link>
        </div>
      </div>

      {/* کارت‌های آماری شاخص‌ها */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {item.title}
                </span>
                <span className={`rounded-xl p-2.5 ${item.color}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {item.value}
                </div>
                <div className="mt-1 flex items-center text-xs">
                  <span
                    className={
                      item.isPositive
                        ? "font-medium text-emerald-600 dark:text-emerald-400"
                        : "font-medium text-amber-600 dark:text-amber-400"
                    }
                  >
                    {item.change}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* بخش پایینی: آخرین سفارش‌ها و هشدارهای انبار */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* جدول آخرین سفارش‌ها */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                آخرین سفارش‌های ثبت‌شده
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                سفارش‌های نیازمند بررسی و ارسال
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              مشاهده همه
              <ArrowUpRight className="h-3.5 w-3.5 rotate-180" />
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-400 dark:border-slate-800">
                  <th className="pb-3 font-medium">شماره سفارش</th>
                  <th className="pb-3 font-medium">مشتری</th>
                  <th className="pb-3 font-medium">مبلغ</th>
                  <th className="pb-3 font-medium">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="group hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                  >
                    <td className="py-3.5 font-mono text-xs font-medium text-slate-900 dark:text-slate-100">
                      {order.id}
                    </td>
                    <td className="py-3.5">
                      <div className="font-medium text-slate-800 dark:text-slate-200">
                        {order.customer}
                      </div>
                      <div className="text-xs text-slate-400 truncate max-w-[200px]">
                        {order.items}
                      </div>
                    </td>
                    <td className="py-3.5 font-medium text-slate-700 dark:text-slate-300">
                      {order.amount}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          order.statusType === "success"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                            : order.statusType === "pending"
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                        }`}
                      >
                        {order.statusType === "success" && (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        {order.statusType === "pending" && (
                          <Clock className="h-3 w-3" />
                        )}
                        {order.statusType === "warning" && (
                          <AlertTriangle className="h-3 w-3" />
                        )}
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* سایدبار وضعیت انبار و دسترسی سریع */}
        <div className="flex flex-col gap-6">
          {/* هشدارهای موجودی */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              هشدار کسری موجودی
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              اقلامی که تعداد موجودی آن‌ها کمتر از حد نصاب است
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-rose-50/70 p-3 text-xs dark:bg-rose-950/30">
                <div>
                  <p className="font-semibold text-rose-900 dark:text-rose-200">
                    کود پتاس بالا ۲ کیلوگرمی
                  </p>
                  <p className="text-rose-600 dark:text-rose-400 mt-0.5">
                    فقط ۲ عدد در انبار باقی مانده
                  </p>
                </div>
                <Link
                  href="/admin/products"
                  className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-rose-700 shadow-xs hover:bg-rose-100 dark:bg-slate-900 dark:text-rose-300"
                >
                  شارژ
                </Link>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-amber-50/70 p-3 text-xs dark:bg-amber-950/30">
                <div>
                  <p className="font-semibold text-amber-900 dark:text-amber-200">
                    بذر خیار گلخانه‌ای داتیس
                  </p>
                  <p className="text-amber-600 dark:text-amber-400 mt-0.5">
                    ۴ قوطی در انبار باقی مانده
                  </p>
                </div>
                <Link
                  href="/admin/products"
                  className="rounded-lg bg-white px-2.5 py-1 text-xs font-medium text-amber-700 shadow-xs hover:bg-amber-100 dark:bg-slate-900 dark:text-amber-300"
                >
                  شارژ
                </Link>
              </div>
            </div>
          </div>

          {/* راه‌های ارتباطی و آمار سریع */}
          <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-br from-emerald-600 to-teal-700 p-6 text-white shadow-xs">
            <h4 className="font-bold text-lg">پشتیبانی و پشتیبان‌گیری</h4>
            <p className="mt-2 text-xs text-emerald-100 leading-relaxed">
              آخرین بک‌آپ دیتابیس با موفقیت دیشب در ساعت ۰۲:۰۰ بامداد ذخیره شد.
              برای اعمال تنظیمات تخفیف یا دسته‌بندی جدید می‌توانید از منوی
              مدیریت اقدام نمایید.
            </p>
            <div className="mt-4 pt-4 border-t border-white/20">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:underline"
              >
                مشاهده فروشگاه اصلی (سایت)
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
