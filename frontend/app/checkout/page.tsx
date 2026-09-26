// src/app/checkout/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder, CreateOrderDto } from "@/lib/orderApi";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, finalPrice, refreshCart } = useCart();
  const { user } = useAuth();

  const [formData, setFormData] = useState<CreateOrderDto>({
    shippingProvince: "",
    shippingCity: "",
    shippingAddress: "",
    shippingPostalCode: "",
    receiverName: "",
    receiverPhone: "",
    paymentMethod: 1, // Online
    items: [],
  });

  // پر کردن اطلاعات تحویل‌گیرنده پس از لود شدن اطلاعات کاربر
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        receiverName: prev.receiverName || user.fullName || "",
        receiverPhone: prev.receiverPhone,
      }));
    }
  }, [user]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formatPrice = (val: number) =>
    new Intl.NumberFormat("fa-IR").format(val) + " تومان";

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-800">
          سبد خرید شما خالی است!
        </h2>
        <p className="mt-2 text-gray-500">
          برای ثبت سفارش ابتدا کالایی به سبد اضافه کنید.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-block rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-emerald-700 transition"
        >
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "paymentMethod" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      // گرفتن توکن از حافظه مرورگر
      const token = localStorage.getItem("token"); // یا کلیدِ ذخیره‌سازی توکن شما اگر نام دیگری دارد

      const payload: CreateOrderDto = {
        ...formData,
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const order = await createOrder(payload);
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "https://localhost:5079/api";

      // فراخوانی API با افزودن هدر Authorization
      const paymentResponse = await fetch(`${baseUrl}/orders/pay/${order.id}`, {
        method: "POST",
        credentials: "include",
      });

      if (!paymentResponse.ok) {
        // اگر هنوز 401 داد، ممکن است توکن منقضی شده باشد
        throw new Error("خطا در درگاه: لطفاً دوباره لاگین کنید.");
      }

      const paymentData = await paymentResponse.json();

      if (paymentData.url) {
        window.location.href = paymentData.url;
      } else {
        throw new Error("URL پرداخت دریافت نشد.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "مشکلی رخ داد.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-black text-gray-900 mb-8">
        تکمیل اطلاعات و ثبت سفارش
      </h1>

      {errorMessage && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-medium text-red-700 border border-red-200">
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-8 lg:grid-cols-12"
      >
        {/* فرم مشخصات آدرس و تحویل‌گیرنده */}
        <div className="space-y-6 lg:col-span-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📍</span> اطلاعات تحویل‌گیرنده و آدرس
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  نام و نام خانوادگی تحویل‌گیرنده *
                </label>
                <input
                  required
                  type="text"
                  name="receiverName"
                  value={formData.receiverName}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500"
                  placeholder="مثال: علی محمدی"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  شماره همراه تماس *
                </label>
                <input
                  required
                  type="tel"
                  name="receiverPhone"
                  value={formData.receiverPhone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 text-left dir-ltr"
                  placeholder="09123456789"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  استان *
                </label>
                <input
                  required
                  type="text"
                  name="shippingProvince"
                  value={formData.shippingProvince}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500"
                  placeholder="مثال: فارس"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  شهر *
                </label>
                <input
                  required
                  type="text"
                  name="shippingCity"
                  value={formData.shippingCity}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500"
                  placeholder="مثال: شیراز"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  آدرس دقیق پستی *
                </label>
                <textarea
                  required
                  rows={2}
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500"
                  placeholder="خیابان، کوچه، پلاک، واحد..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  کد پستی (۱۰ رقمی) *
                </label>
                <input
                  required
                  type="text"
                  name="shippingPostalCode"
                  value={formData.shippingPostalCode}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm outline-none focus:border-emerald-500 text-left dir-ltr"
                  placeholder="7100000000"
                />
              </div>
            </div>
          </div>

          {/* شیوه پرداخت */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>💳</span> شیوه پرداخت
            </h2>

            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 hover:border-emerald-500 cursor-pointer transition">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={1}
                  checked={formData.paymentMethod === 1}
                  onChange={handleChange}
                  className="accent-emerald-600 h-4 w-4"
                />
                <div>
                  <div className="text-sm font-bold text-gray-800">
                    پرداخت اینترنتی آنلاین
                  </div>
                  <div className="text-xs text-gray-500">
                    متصل به کلیه کارت‌های عضو شتاب
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 hover:border-emerald-500 cursor-pointer transition">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={2}
                  checked={formData.paymentMethod === 2}
                  onChange={handleChange}
                  className="accent-emerald-600 h-4 w-4"
                />
                <div>
                  <div className="text-sm font-bold text-gray-800">
                    کارت به کارت / حواله بانکی
                  </div>
                  <div className="text-xs text-gray-500">
                    ارسال فیش واریزی به پشتیبانی پس از ثبت
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* سایدبار خلاصه سفارش */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h3 className="text-base font-bold text-gray-900 mb-4">
              خلاصه فاکتور
            </h3>

            <div className="space-y-3 border-b border-gray-200 pb-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>تعداد اقلام</span>
                <span>
                  {cart.items.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  کالا
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>هزینه ارسال</span>
                <span className="text-emerald-600 font-medium">
                  پس‌کرایه (باربری/تیپاکس)
                </span>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-baseline">
              <span className="font-bold text-gray-800">مبلغ نهایی:</span>
              <span className="text-xl font-black text-emerald-700">
                {formatPrice(finalPrice)}
              </span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-xl bg-emerald-600 py-3.5 text-center font-bold text-white shadow-md hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {isSubmitting ? "در حال ثبت سفارش..." : "تأیید و پرداخت نهایی"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
