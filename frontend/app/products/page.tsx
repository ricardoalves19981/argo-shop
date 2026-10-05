"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import {
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  PackageCheck,
  RotateCcw,
} from "lucide-react";

// مدل منطبق بر خروجی ProductListDto در دات‌نت
interface Product {
  id: number;
  name: string;
  technicalName?: string;
  categoryId: number;
  categoryName: string;
  price: number;
  discountPrice?: number | null;
  stockQuantity: number;
  unit: string;
  mainImageUrl?: string | null;
  brandName?: string | null;
  preHarvestIntervalDays?: number | null;
  isActive: boolean;
}

interface PaginationData {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // استیت‌های داده
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    totalCount: 0,
    pageNumber: 1,
    pageSize: 12,
    totalPages: 1,
  });

  // استیت‌های فیلتر
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [categoryName, setCategoryName] = useState(
    searchParams.get("category") || "",
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");
  const [inStockOnly, setInStockOnly] = useState(
    searchParams.get("inStock") === "true",
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  // وضعیت باز/بسته بودن سایدبار فیلتر در موبایل
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // فراخوانی داده‌ها از کنترلر دات‌نت
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/products", {
        params: {
          PageNumber: page,
          PageSize: 12,
          Search: search || undefined,
          CategoryName: categoryName || undefined,
          SortBy: sortBy,
          InStockOnly: inStockOnly || undefined,
          MinPrice: minPrice ? Number(minPrice) : undefined,
          MaxPrice: maxPrice ? Number(maxPrice) : undefined,
        },
      });

      setProducts(res.data.data || []);
      setPagination({
        totalCount: res.data.totalCount,
        pageNumber: res.data.pageNumber,
        pageSize: res.data.pageSize,
        totalPages: res.data.totalPages,
      });
    } catch (err) {
      console.error("خطا در دریافت لیست محصولات:", err);
    } finally {
      setLoading(false);
    }
  }, [page, categoryName, sortBy, inStockOnly, minPrice, maxPrice]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ثبت سرچ با اینتر یا کلیک دکمه
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  // ریست کردن تمام فیلترها
  const handleResetFilters = () => {
    setSearch("");
    setCategoryName("");
    setSortBy("newest");
    setInStockOnly(false);
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-6" dir="rtl">
      {/* نوار بالایی: جستجو و تیتر */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            کاتالوگ نهاده‌ها و محصولات کشاورزی
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            مجموعاً {pagination.totalCount.toLocaleString("fa-IR")} محصول موجود
            است
          </p>
        </div>

        {/* سرچ‌بار */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex gap-2 w-full lg:w-96"
        >
          <div className="relative w-full">
            <input
              type="text"
              placeholder="جستجوی نام سم، ماده موثره، آفت..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
          </div>
          <button
            type="submit"
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition shrink-0"
          >
            جستجو
          </button>
        </form>
      </div>

      {/* دکمه باز کردن فیلتر در موبایل و مرتب‌سازی */}
      <div className="flex items-center justify-between lg:hidden mb-4 bg-white p-3 rounded-lg border border-gray-200">
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700"
        >
          <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
          فیلترهای پیشرفته
        </button>
        <span className="text-xs text-gray-500">
          صفحه {pagination.pageNumber} از {pagination.totalPages}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ===================== سایدبار فیلترها (دسکتاپ) ===================== */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="bg-white p-5 rounded-xl border border-gray-200 sticky top-4 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="font-bold text-gray-800 flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-600" />
                فیلترها
              </span>
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-500 hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                حذف فیلترها
              </button>
            </div>

            {/* دسته‌بندی‌ها */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                دسته‌بندی
              </label>
              <div className="space-y-1">
                {[
                  { label: "همه دسته‌ها", value: "" },
                  { label: "سموم و آفت‌کش‌ها", value: "سم" },
                  { label: "کودهای تقویتی", value: "کود" },
                  { label: "بذر و پیاز", value: "بذر" },
                  { label: "علف‌کش‌ها", value: "علف" },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => {
                      setCategoryName(item.value);
                      setPage(1);
                    }}
                    className={`w-full text-right px-3 py-1.5 rounded-lg text-sm transition ${
                      categoryName === item.value
                        ? "bg-emerald-50 text-emerald-700 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* وضعیت موجودی */}
            <div className="pt-4 border-t border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => {
                    setInStockOnly(e.target.checked);
                    setPage(1);
                  }}
                  className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                />
                فقط کالاهای موجود
              </label>
            </div>

            {/* محدوده قیمت */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <label className="text-sm font-semibold text-gray-700 block">
                محدوده قیمت (تومان)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] text-gray-500">از قیمت:</span>
                  <input
                    type="number"
                    value={minPrice}
                    placeholder="0"
                    onChange={(e) => {
                      setMinPrice(e.target.value);
                      setPage(1);
                    }}
                    className="w-full text-xs p-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-gray-500">تا قیمت:</span>
                  <input
                    type="number"
                    value={maxPrice}
                    placeholder="حداکثر"
                    onChange={(e) => {
                      setMaxPrice(e.target.value);
                      setPage(1);
                    }}
                    className="w-full text-xs p-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== لیست محصولات و مرتب‌سازی ===================== */}
        <div className="lg:col-span-3 space-y-4">
          {/* نوار بالایی: مرتب‌سازی */}
          <div className="bg-white p-3 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs">مرتب‌سازی:</span>
              {[
                { label: "جدیدترین", value: "newest" },
                { label: "ارزان‌ترین", value: "price_asc" },
                { label: "گران‌ترین", value: "price_desc" },
              ].map((sort) => (
                <button
                  key={sort.value}
                  onClick={() => {
                    setSortBy(sort.value);
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                    sortBy === sort.value
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>

          {/* کارت‌های محصولات */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-80 bg-white border border-gray-100 rounded-xl p-4 animate-pulse space-y-3"
                >
                  <div className="h-44 bg-gray-100 rounded-lg"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="text-4xl mb-3">🌾</div>
              <h3 className="font-bold text-gray-700">
                محصولی مطابق فیلترهای انتخابی یافت نشد
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                لطفاً فیلترها را تغییر داده یا جستجو را ریست کنید.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 px-4 py-2 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg hover:bg-emerald-100 transition"
              >
                حذف فیلترها
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((p) => {
                // تعیین قیمت نهایی و تخفیف
                const hasDiscount =
                  p.discountPrice && p.discountPrice < p.price;
                const finalPrice = hasDiscount ? p.discountPrice! : p.price;

                return (
                  <div
                    key={p.id}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col group"
                  >
                    {/* تصویر محصول */}
                    <div className="relative h-48 bg-gray-50 flex items-center justify-center p-3 overflow-hidden">
                      {p.mainImageUrl ? (
                        <img
                          src={p.mainImageUrl}
                          alt={p.name}
                          className="object-contain h-full w-full group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <span className="text-5xl">📦</span>
                      )}

                      {/* کارنس */}
                      {p.preHarvestIntervalDays && (
                        <span className="absolute top-2 right-2 bg-amber-100 text-amber-900 text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm">
                          کارنس: {p.preHarvestIntervalDays} روز
                        </span>
                      )}

                      {/* برند */}
                      {p.brandName && (
                        <span className="absolute bottom-2 left-2 bg-white/90 backdrop-blur text-gray-600 text-[10px] px-2 py-0.5 rounded border border-gray-100">
                          {p.brandName}
                        </span>
                      )}
                    </div>

                    {/* اطلاعات متنی */}
                    <div className="p-4 flex flex-col flex-1 justify-between">
                      <div>
                        <span className="text-[11px] text-emerald-600 font-medium">
                          {p.categoryName}
                        </span>
                        <h3 className="font-bold text-gray-800 text-sm mt-0.5 line-clamp-1">
                          {p.name}
                        </h3>
                        {p.technicalName && (
                          <p
                            className="text-xs text-gray-400 font-mono mt-0.5 line-clamp-1"
                            dir="ltr"
                          >
                            {p.technicalName}
                          </p>
                        )}
                        <p className="text-[11px] text-gray-400 mt-2">
                          واحد: {p.unit}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-end justify-between">
                        <div>
                          {hasDiscount && (
                            <span className="block text-xs text-gray-400 line-through">
                              {p.price.toLocaleString("fa-IR")}
                            </span>
                          )}
                          <div className="font-bold text-emerald-700 text-base">
                            {finalPrice.toLocaleString("fa-IR")}{" "}
                            <span className="text-[10px] font-normal text-gray-500">
                              تومان
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/products/${p.id}`}
                          className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg hover:bg-emerald-600 hover:text-white transition"
                        >
                          مشاهده
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ===================== پیجینیشن (Pagination) ===================== */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {/* دکمه قبلی */}
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* شماره صفحات */}
              {[...Array(pagination.totalPages)].map((_, index) => {
                const pageNum = index + 1;
                // نمایش هوشمند در صورتی که تعداد صفحات خیلی زیاد باشد
                if (
                  pageNum === 1 ||
                  pageNum === pagination.totalPages ||
                  (pageNum >= page - 1 && pageNum <= page + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-9 h-9 rounded-lg text-xs font-semibold transition ${
                        page === pageNum
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {pageNum.toLocaleString("fa-IR")}
                    </button>
                  );
                } else if (pageNum === page - 2 || pageNum === page + 2) {
                  return (
                    <span key={pageNum} className="text-gray-400 text-xs">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              {/* دکمه بعدی */}
              <button
                disabled={page >= pagination.totalPages}
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, pagination.totalPages))
                }
                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===================== مدال فیلتر موبایل ===================== */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full p-5 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b">
              <span className="font-bold text-gray-800">فیلتر محصولات</span>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* دسته‌ها */}
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">
                دسته‌بندی
              </label>
              <div className="space-y-1">
                {[
                  { label: "همه دسته‌ها", value: "" },
                  { label: "سموم و آفت‌کش‌ها", value: "سم" },
                  { label: "کودهای تقویتی", value: "کود" },
                  { label: "بذر و پیاز", value: "بذر" },
                ].map((item) => (
                  <button
                    key={item.value}
                    onClick={() => {
                      setCategoryName(item.value);
                      setPage(1);
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-right px-3 py-2 rounded-lg text-sm ${
                      categoryName === item.value
                        ? "bg-emerald-50 text-emerald-700 font-bold"
                        : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* دکمه اعمال و بستن */}
            <div className="pt-4 border-t">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full bg-emerald-600 text-white py-2.5 rounded-lg text-sm font-semibold"
              >
                مشاهده نتایج
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
