"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      // ارسال به AuthController دات‌نت
      const res = await api.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const { token, user } = res.data;

      // 1) ذخیره در کوکی (برای اینکه SSR بتواند token را بخواند)
      // نکته: نام کوکی را با کد /orders یکسان نگه دار
      document.cookie = `agro-token=${encodeURIComponent(
        token,
      )}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;

      // 2) ثبت در استیت برنامه (Context)
      login(token, user);

      // هدایت کاربر: اولویت با returnUrl است، سپس نقش ادمین، سپس صفحه اصلی
      if (returnUrl) {
        router.push(returnUrl);
      } else if (user?.role === "Admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("ایمیل یا رمز عبور اشتباه است.");
      } else {
        setError(
          "خطا در برقراری ارتباط با سرور. لطفا وضعیت بک‌اند را بررسی کنید.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="text-center mb-8">
          <span className="text-4xl">🌱</span>
          <h1 className="text-2xl font-bold text-gray-800 mt-2">
            ورود به حساب کاربری
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            برای خرید و دسترسی به سفارش‌ها وارد شوید
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg mb-6 leading-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ایمیل
            </label>
            <input
              type="email"
              required
              dir="ltr"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                رمز عبور
              </label>
            </div>
            <input
              type="password"
              required
              dir="ltr"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 transition"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed mt-2"
          >
            {submitting ? "در حال ورود..." : "ورود به حساب"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          حساب کاربری ندارید؟{" "}
          <Link
            href="/register"
            className="text-green-700 font-semibold hover:underline"
          >
            ثبت‌نام کنید
          </Link>
        </div>
      </div>
    </div>
  );
}
