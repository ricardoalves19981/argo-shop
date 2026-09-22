"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2, UploadCloud, X } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // استیت تصاویر انتخابی و پیش‌نمایش
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // استیت فیلدهای فرم
  const [formData, setFormData] = useState({
    name: "",
    technicalName: "",
    categoryId: 1,
    brandId: "",
    price: "",
    discountPrice: "",
    stockQuantity: "",
    unit: "بسته",
    isActive: true,
    description: "",
    activeIngredient: "",
    formulation: "",
    targetPests: "",
    suitableCrops: "",
    usageInstruction: "",
    preHarvestIntervalDays: "",
    registrationCode: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...filesArray]);

      const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let uploadedImageUrls: string[] = [];

      // ۱. ابتدا اگر عکسی انتخاب شده، آپلود انجام می‌شود
      if (selectedFiles.length > 0) {
        const uploadData = new FormData();
        selectedFiles.forEach((file) => {
          uploadData.append("files", file);
        });

        const uploadRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/upload/product-images`,
          {
            method: "POST",
            credentials: "include",
            body: uploadData,
          },
        );

        if (!uploadRes.ok) {
          throw new Error("خطا در آپلود تصاویر");
        }

        const uploadResult = await uploadRes.json();
        uploadedImageUrls = uploadResult.urls;
      }

      // ۲. آماده‌سازی داده نهایی برای CreateProduct
      const payload = {
        ...formData,
        categoryId: Number(formData.categoryId),
        brandId: formData.brandId ? Number(formData.brandId) : null,
        price: Number(formData.price),
        discountPrice: formData.discountPrice
          ? Number(formData.discountPrice)
          : null,
        stockQuantity: Number(formData.stockQuantity),
        preHarvestIntervalDays: formData.preHarvestIntervalDays
          ? Number(formData.preHarvestIntervalDays)
          : null,
        imageUrls: uploadedImageUrls,
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "خطا در ثبت اطلاعات محصول");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "خطایی رخ داد");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <Link
            href="/admin/products"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            <ArrowRight className="h-4 w-4 ml-1" />
            بازگشت
          </Link>
          <h1 className="text-xl font-bold">افزودن محصول جدید</h1>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* بخش آپلود عکس */}
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800 border-b pb-2">
            تصاویر محصول
          </h2>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition cursor-pointer relative">
            <input
              type="file"
              multiple
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center">
              <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">
                برای انتخاب تصاویر کلیک کنید
              </p>
              <p className="text-xs text-gray-400 mt-1">
                فرمت‌های مجاز: JPG, PNG, WEBP
              </p>
            </div>
          </div>

          {/* پیش‌نمایش عکس‌های انتخاب‌شده */}
          {previews.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-4">
              {previews.map((url, index) => (
                <div
                  key={index}
                  className="relative group rounded-md overflow-hidden border aspect-square"
                >
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] text-center py-0.5">
                      تصویر اصلی
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* اطلاعات اصلی */}
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800 border-b pb-2">
            اطلاعات اصلی
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">نام تجاری محصول *</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="مثلاً: قارچ‌کش بردوفیکس"
                required
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">نام فنی / علمی</label>
              <Input
                name="technicalName"
                value={formData.technicalName}
                onChange={handleChange}
                placeholder="Bordeaux Mixture"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">شناسه دسته‌بندی *</label>
              <Input
                type="number"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">واحد شمارش</label>
              <Input
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* قیمت و موجودی */}
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800 border-b pb-2">
            قیمت و موجودی انبار
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">قیمت فروش (تومان) *</label>
              <Input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                قیمت تخفیف‌خورده (تومان)
              </label>
              <Input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                placeholder="اختیاری"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">موجودی انبار *</label>
              <Input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-primary cursor-pointer"
            />
            <label
              htmlFor="isActive"
              className="text-sm select-none cursor-pointer"
            >
              محصول فعال باشد و در سایت نمایش داده شود
            </label>
          </div>
        </div>

        {/* مشخصات کشاورزی */}
        <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
          <h2 className="font-semibold text-gray-800 border-b pb-2">
            مشخصات تخصصی کشاورزی
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">ماده مؤثره</label>
              <Input
                name="activeIngredient"
                value={formData.activeIngredient}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">فرمولاسیون</label>
              <Input
                name="formulation"
                value={formData.formulation}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                آفات / بیماری‌های هدف
              </label>
              <Input
                name="targetPests"
                value={formData.targetPests}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">دوره کارنس (روز)</label>
              <Input
                type="number"
                name="preHarvestIntervalDays"
                value={formData.preHarvestIntervalDays}
                onChange={handleChange}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">دستور و نکات مصرف</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-input bg-background p-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/products"
            className={buttonVariants({ variant: "outline" })}
          >
            انصراف
          </Link>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            ثبت نهایی محصول
          </Button>
        </div>
      </form>
    </div>
  );
}
