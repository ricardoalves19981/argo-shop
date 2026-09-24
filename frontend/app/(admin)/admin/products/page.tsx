"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  PlusCircle,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Search,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  technicalName?: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  unit: string;
  isActive: boolean;
  categoryName?: string;
  brandName?: string;
  mainImageUrl?: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5079/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // تابع کمکی برای گرفتن هدرها (در صورت وجود توکن در استوریج ارسال می‌شود)
  const getAuthHeaders = (): HeadersInit => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token") || localStorage.getItem("accessToken")
        : null;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }

    return headers;
  };

  // دریافت لیست محصولات از بک‌اند
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // ارسال درخواست با فعال‌سازی کوکی‌ها (credentials: "include")
      const res = await fetch(`${API_BASE_URL}/products?pageSize=100`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include", // 👈 این خط مشکل کوکی و ۴۰۱ را حل می‌کند
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error(
            "نشست کاربری شما منقضی شده است؛ لطفاً مجدداً وارد شوید.",
          );
        }
        if (res.status === 403) {
          throw new Error("شما دسترسی ادمین برای مشاهده این بخش را ندارید.");
        }
        throw new Error("خطا در دریافت لیست محصولات");
      }

      const resData = await res.json();

      // استخراج داده‌ها (سازگار با فرمت‌های مختلف خروجی API)
      const items = Array.isArray(resData?.data?.items)
        ? resData.data.items
        : Array.isArray(resData?.data)
          ? resData.data
          : Array.isArray(resData?.items)
            ? resData.items
            : Array.isArray(resData)
              ? resData
              : [];

      setProducts(items);
    } catch (err: any) {
      setError(err.message || "خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const showSuccess = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3500);
  };

  // عملیات حذف محصول
  const handleDeleteProduct = async (id: number, name: string) => {
    if (!confirm(`آیا از حذف محصول «${name}» اطمینان دارید؟`)) return;

    setDeletingId(id);
    setError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include", // 👈 برای درخواست حذف هم کوکی ارسال می‌شود
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("نشست شما منقضی شده است. لطفاً مجدداً وارد شوید.");
        }
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "خطا در حذف محصول");
      }

      showSuccess("محصول با موفقیت حذف شد.");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      setError(err.message || "خطا در حذف محصول");
    } finally {
      setDeletingId(null);
    }
  };

  // فیلتر جستجو کلاینت
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.technicalName &&
        p.technicalName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.categoryName &&
        p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.brandName &&
        p.brandName.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="p-6 md:p-8 space-y-6" dir="rtl">
      {/* هدر صفحه */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">مدیریت محصولات</h1>
          <p className="text-sm text-slate-500 mt-1">
            مشاهده، ویرایش و حذف نهاده‌ها، سموم و کودهای کشاورزی
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          افزودن محصول جدید
        </Link>
      </div>

      {/* پیام‌های اعلان */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-3 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* نوار جستجو و ابزار */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 flex items-center gap-3 shadow-xs">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="جستجوی محصول با نام تجاری یا ماده موثره / ژنریک..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-sm outline-none bg-transparent text-slate-800 placeholder:text-slate-400"
        />
        <span className="text-xs text-slate-400 whitespace-nowrap">
          {filteredProducts.length} محصول
        </span>
      </div>

      {/* جدول لیست محصولات */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            در حال بارگذاری لیست محصولات...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            هیچ محصولی یافت نشد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-xs font-semibold text-slate-500">
                <tr>
                  <th className="py-3.5 px-4">شناسه</th>
                  <th className="py-3.5 px-4">نام محصول</th>
                  <th className="py-3.5 px-4">قیمت (تومان)</th>
                  <th className="py-3.5 px-4">موجودی</th>
                  <th className="py-3.5 px-4">دسته‌بندی / برند</th>
                  <th className="py-3.5 px-4">وضعیت</th>
                  <th className="py-3.5 px-4 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-slate-50/60 transition"
                  >
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-400">
                      #{product.id}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {product.name}
                      </div>
                      {product.technicalName && (
                        <div className="text-xs text-slate-400 mt-0.5">
                          {product.technicalName}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {product.price
                        ? product.price.toLocaleString("fa-IR")
                        : "۰"}
                      {product.discountPrice ? (
                        <div className="text-xs text-emerald-600">
                          تخفیف: {product.discountPrice.toLocaleString("fa-IR")}
                        </div>
                      ) : null}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${
                          product.stockQuantity > 5
                            ? "bg-emerald-50 text-emerald-700"
                            : product.stockQuantity > 0
                              ? "bg-amber-50 text-amber-700"
                              : "bg-red-50 text-red-700"
                        }`}
                      >
                        {product.stockQuantity} {product.unit || "عدد"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      <div>{product.categoryName || "—"}</div>
                      <div className="text-slate-400">
                        {product.brandName || "—"}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {product.isActive ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <Eye className="w-3.5 h-3.5" />
                          فعال
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-medium">
                          <EyeOff className="w-3.5 h-3.5" />
                          غیرفعال
                        </span>
                      )}
                    </td>

                    {/* دکمه‌های عملیات */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* ویرایش */}
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title="ویرایش محصول"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>

                        {/* حذف */}
                        <button
                          onClick={() =>
                            handleDeleteProduct(product.id, product.name)
                          }
                          disabled={deletingId === product.id}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                          title="حذف محصول"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
