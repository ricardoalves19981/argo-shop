"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Upload,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface Brand {
  id: number;
  name: string;
}

interface ProductImage {
  id?: number;
  imageUrl: string;
  isPrimary?: boolean;
}

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);

  // استیت‌های فرم
  const [formData, setFormData] = useState({
    name: "",
    technicalName: "",
    description: "",
    price: "",
    discountPrice: "",
    stockQuantity: "",
    unit: "بسته",
    isActive: true,
    categoryId: "",
    brandId: "",
    // فیلدهای کشاورزی
    activeIngredient: "",
    formulation: "",
    targetPests: "",
    suitableCrops: "",
    usageInstruction: "",
    preHarvestIntervalDays: "",
    registrationCode: "",
  });

  const [images, setImages] = useState<string[]>([]);

  // ۱. واکشی داده‌های اولیه (محصول، دسته‌بندی‌ها، برندها)
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [productRes, catRes, brandRes] = await Promise.all([
          fetch(`http://localhost:5079/api/products/${id}`),
          fetch(`http://localhost:5079/api/categories`).catch(() => null),
          fetch(`http://localhost:5079/api/brands`).catch(() => null),
        ]);

        if (!productRes.ok) {
          throw new Error("خطا در بارگذاری مشخصات محصول");
        }

        const product = await productRes.json();

        // پر کردن فیلدهای فرم با مقادیر موجود
        setFormData({
          name: product.name || "",
          technicalName: product.technicalName || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          discountPrice: product.discountPrice?.toString() || "",
          stockQuantity: product.stockQuantity?.toString() || "",
          unit: product.unit || "بسته",
          isActive: product.isActive ?? true,
          categoryId: product.categoryId?.toString() || "",
          brandId: product.brandId?.toString() || "",
          activeIngredient: product.activeIngredient || "",
          formulation: product.formulation || "",
          targetPests: product.targetPests || "",
          suitableCrops: product.suitableCrops || "",
          usageInstruction: product.usageInstruction || "",
          preHarvestIntervalDays:
            product.preHarvestIntervalDays?.toString() || "",
          registrationCode: product.registrationCode || "",
        });

        // پر کردن تصاویر
        if (product.images && Array.isArray(product.images)) {
          setImages(product.images.map((img: ProductImage) => img.imageUrl));
        }

        // پر کردن لیست دسته‌ها
        if (catRes && catRes.ok) {
          const cats = await catRes.json();
          setCategories(Array.isArray(cats) ? cats : cats.items || []);
        }

        // پر کردن لیست برندها
        if (brandRes && brandRes.ok) {
          const brs = await brandRes.json();
          setBrands(Array.isArray(brs) ? brs : brs.items || []);
        }
      } catch (err: any) {
        setError(err.message || "خطا در برقراری ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  // ۲. مدیریت آپلود عکس جدید
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingImage(true);
      const uploadData = new FormData();
      for (let i = 0; i < files.length; i++) {
        uploadData.append("files", files[i]);
      }

      const res = await fetch("http://localhost:5079/api/upload/products", {
        method: "POST",
        body: uploadData,
      });

      if (!res.ok) throw new Error("آپلود تصویر ناموفق بود");

      const data = await res.json();
      // data.urls یا data.url بسته به کنترلر آپلود شما
      const uploadedUrls: string[] = data.urls || (data.url ? [data.url] : []);
      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (err: any) {
      alert(err.message || "خطا در آپلود عکس");
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // ۳. ارسال فرم به API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        technicalName: formData.technicalName || null,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        discountPrice: formData.discountPrice
          ? parseFloat(formData.discountPrice)
          : null,
        stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
        unit: formData.unit,
        isActive: formData.isActive,
        categoryId: parseInt(formData.categoryId, 10),
        brandId: formData.brandId ? parseInt(formData.brandId, 10) : null,
        activeIngredient: formData.activeIngredient || null,
        formulation: formData.formulation || null,
        targetPests: formData.targetPests || null,
        suitableCrops: formData.suitableCrops || null,
        usageInstruction: formData.usageInstruction || null,
        preHarvestIntervalDays: formData.preHarvestIntervalDays
          ? parseInt(formData.preHarvestIntervalDays, 10)
          : null,
        registrationCode: formData.registrationCode || null,
        imageUrls: images,
      };

      const res = await fetch(`http://localhost:5079/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "خطا در به‌روزرسانی محصول");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/products");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "خطایی رخ داد");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
        <p className="text-sm text-gray-500">
          در حال بارگذاری اطلاعات محصول...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-16">
      {/* هدر صفحه */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/admin/products" className="hover:text-gray-800">
              محصولات
            </Link>
            <span>/</span>
            <span>ویرایش محصول</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">
            ویرایش: {formData.name}
          </h1>
        </div>

        <Link
          href="/admin/products"
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت به لیست
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>محصول با موفقیت ذخیره شد. در حال انتقال به لیست...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* ۱. اطلاعات پایه و قیمت */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
            اطلاعات پایه و قیمت‌گذاری
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام تجاری محصول (فارسی) *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نام ژنریک یا تکنیکال
              </label>
              <input
                type="text"
                placeholder="مثال: مانکوزب ۸۰٪ WP"
                value={formData.technicalName}
                onChange={(e) =>
                  setFormData({ ...formData, technicalName: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                دسته‌بندی *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              >
                <option value="">انتخاب دسته‌بندی</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                برند یا سازنده
              </label>
              <select
                value={formData.brandId}
                onChange={(e) =>
                  setFormData({ ...formData, brandId: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              >
                <option value="">انتخاب برند (اختیاری)</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                قیمت اصلی (تومان) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                قیمت با تخفیف (تومان)
              </label>
              <input
                type="number"
                min="0"
                placeholder="اختیاری"
                value={formData.discountPrice}
                onChange={(e) =>
                  setFormData({ ...formData, discountPrice: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                موجودی انبار *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.stockQuantity}
                onChange={(e) =>
                  setFormData({ ...formData, stockQuantity: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                واحد بسته‌بندی
              </label>
              <input
                type="text"
                placeholder="مثال: قوطی ۱ لیتری، بسته ۱ کیلوگرمی"
                value={formData.unit}
                onChange={(e) =>
                  setFormData({ ...formData, unit: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              توضیحات و معرفی محصول
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700"
            >
              محصول فعال و قابل فروش باشد
            </label>
          </div>
        </div>

        {/* ۲. فیلدهای تخصصی کشاورزی */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">
            مشخصات فنی و کشاورزی
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ماده موثره (Active Ingredient)
              </label>
              <input
                type="text"
                placeholder="مثال: کلرپیروس ۴۰.۸٪"
                value={formData.activeIngredient}
                onChange={(e) =>
                  setFormData({ ...formData, activeIngredient: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                نوع فرمولاسیون
              </label>
              <input
                type="text"
                placeholder="مثال: EC, SC, WP, SL"
                value={formData.formulation}
                onChange={(e) =>
                  setFormData({ ...formData, formulation: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                آفات / بیماری‌های هدف
              </label>
              <input
                type="text"
                placeholder="مثال: سفیدک پودری، شته مومی، شپشک"
                value={formData.targetPests}
                onChange={(e) =>
                  setFormData({ ...formData, targetPests: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                محصولات هدف
              </label>
              <input
                type="text"
                placeholder="مثال: پسته، انگور، خیار گلخانه‌ای"
                value={formData.suitableCrops}
                onChange={(e) =>
                  setFormData({ ...formData, suitableCrops: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                دوره کارنس (روز)
              </label>
              <input
                type="number"
                min="0"
                placeholder="مثال: ۱۴"
                value={formData.preHarvestIntervalDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    preHarvestIntervalDays: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                شماره ثبت در سازمان حفظ نباتات
              </label>
              <input
                type="text"
                placeholder="مثال: ۹۹/۷۴۸/س"
                value={formData.registrationCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    registrationCode: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              دستور و میزان مصرف
            </label>
            <textarea
              rows={3}
              placeholder="مثال: ۱.۵ تا ۲ لیتر در هزار لیتر آب هنگام مشاهده اولین علائم آلودگی"
              value={formData.usageInstruction}
              onChange={(e) =>
                setFormData({ ...formData, usageInstruction: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* ۳. گالری تصاویر */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-lg font-semibold text-gray-900">
              تصاویر محصول
            </h2>
            {uploadingImage && (
              <span className="flex items-center gap-1 text-xs text-emerald-600">
                <Loader2 className="h-3 w-3 animate-spin" /> در حال آپلود...
              </span>
            )}
          </div>

          {/* پیش‌نمایش عکس‌های فعلی */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {images.map((url, index) => (
              <div
                key={index}
                className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={
                    url.startsWith("http") ? url : `http://localhost:5081${url}`
                  }
                  alt={`Product Image ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute left-1 top-1 rounded-full bg-red-600 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  title="حذف تصویر"
                >
                  <X className="h-3 w-3" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-white">
                    عکس اصلی
                  </span>
                )}
              </div>
            ))}

            {/* باکس دکمه آپلود جدید */}
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-emerald-500 hover:bg-emerald-50/50">
              <Upload className="h-6 w-6 text-gray-400" />
              <span className="mt-1 text-xs text-gray-500">افزودن تصویر</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* دکمه‌های اقدام */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/products"
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            انصراف
          </Link>

          <button
            type="submit"
            disabled={submitting || uploadingImage}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            ذخیره تغییرات
          </button>
        </div>
      </form>
    </div>
  );
}
