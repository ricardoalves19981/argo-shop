"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Tag,
  Award,
  FolderTree,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  slug: string;
  imageUrl?: string;
  parentId?: number | null;
}

interface Brand {
  id: number;
  name: string;
  country?: string;
  logoUrl?: string;
  productsCount: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5079";

export default function CategoriesAndBrandsPage() {
  const [activeTab, setActiveTab] = useState<"categories" | "brands">(
    "categories",
  );

  // State دسته‌بندی‌ها
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatParentId, setNewCatParentId] = useState<string>("");

  // State برندها
  const [brands, setBrands] = useState<Brand[]>([]);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandCountry, setNewBrandCountry] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // بارگذاری داده‌ها
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [catsRes, brandsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/categories`),
        fetch(`${API_BASE_URL}/brands`),
      ]);

      if (catsRes.ok) {
        const catsData = await catsRes.json();
        setCategories(Array.isArray(catsData) ? catsData : []);
      }
      if (brandsRes.ok) {
        const brandsData = await brandsRes.json();
        setBrands(Array.isArray(brandsData) ? brandsData : []);
      }
    } catch (err) {
      setError("خطا در برقراری ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showSuccessMsg = (msg: string) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(null), 3000);
  };

  // افزودن دسته‌بندی جدید
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newCatName.trim(),
          parentId: newCatParentId ? parseInt(newCatParentId) : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "خطا در افزودن دسته‌بندی");
      }

      setNewCatName("");
      setNewCatParentId("");
      showSuccessMsg("دسته‌بندی با موفقیت افزوده شد.");
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // حذف دسته‌بندی
  const handleDeleteCategory = async (id: number) => {
    if (!confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "امکان حذف دسته‌بندی وجود ندارد.");
      }

      showSuccessMsg("دسته‌بندی حذف شد.");
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // افزودن برند جدید
  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;

    try {
      const res = await fetch(`${API_BASE_URL}/brands`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newBrandName.trim(),
          country: newBrandCountry.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "خطا در افزودن برند");
      }

      setNewBrandName("");
      setNewBrandCountry("");
      showSuccessMsg("برند با موفقیت افزوده شد.");
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // حذف برند
  const handleDeleteBrand = async (id: number) => {
    if (!confirm("آیا از حذف این برند اطمینان دارید؟")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/brands/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "امکان حذف برند وجود ندارد.");
      }

      showSuccessMsg("برند حذف شد.");
      fetchData();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto" dir="rtl">
      {/* عنوان و ناوبری تب‌ها */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            مدیریت دسته‌بندی‌ها و برندها
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            تعریف و ویرایش دسته‌بندی محصولات کشاورزی، کودها، سموم و برندهای
            تولیدکننده
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => {
              setActiveTab("categories");
              setError(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "categories"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FolderTree className="w-4 h-4" />
            دسته‌بندی‌ها ({categories.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("brands");
              setError(null);
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "brands"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Award className="w-4 h-4" />
            برندها ({brands.length})
          </button>
        </div>
      </div>

      {/* پیام‌های وضعیت */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* محتوای تب دسته‌بندی‌ها */}
      {activeTab === "categories" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* فرم ثبت دسته‌بندی */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              افزودن دسته‌بندی جدید
            </h2>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام دسته‌بندی *
                </label>
                <input
                  type="text"
                  placeholder="مثال: سموم حشره‌کش، کود NPK"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  دسته‌بندی والد (اختیاری)
                </label>
                <select
                  value={newCatParentId}
                  onChange={(e) => setNewCatParentId(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm bg-white"
                >
                  <option value="">بدون والد (دسته اصلی)</option>
                  {categories
                    .filter((c) => !c.parentId)
                    .map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl transition duration-200 text-sm shadow-sm"
              >
                ثبت دسته‌بندی
              </button>
            </form>
          </div>

          {/* لیست دسته‌بندی‌ها */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              لیست دسته‌بندی‌ها
            </h2>
            {loading && categories.length === 0 ? (
              <p className="text-gray-400 text-sm">در حال بارگذاری...</p>
            ) : categories.length === 0 ? (
              <p className="text-gray-400 text-sm">
                هنوز دسته‌بندی ثبت نشده است.
              </p>
            ) : (
              <div className="divide-y divide-gray-100">
                {categories.map((cat) => (
                  <div
                    key={cat.id}
                    className="py-3 flex items-center justify-between hover:bg-gray-50 px-3 rounded-lg transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                        <Tag className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {cat.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          شناسه: {cat.id} | Slug: {cat.slug}{" "}
                          {cat.parentId
                            ? `(زیردسته کد ${cat.parentId})`
                            : "(دسته اصلی)"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="text-gray-400 hover:text-red-600 p-2 rounded-lg transition"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* محتوای تب برندها */}
      {activeTab === "brands" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* فرم ثبت برند */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-600" />
              افزودن برند جدید
            </h2>
            <form onSubmit={handleAddBrand} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نام برند / کمپانی *
                </label>
                <input
                  type="text"
                  placeholder="مثال: سینجنتا، بایر، رازی"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  کشور سازنده (اختیاری)
                </label>
                <input
                  type="text"
                  placeholder="مثال: سوئیس، آلمان، ایران"
                  value={newBrandCountry}
                  onChange={(e) => setNewBrandCountry(e.target.value)}
                  className="w-full px-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl transition duration-200 text-sm shadow-sm"
              >
                ثبت برند
              </button>
            </form>
          </div>

          {/* لیست برندها */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              لیست برندها
            </h2>
            {loading && brands.length === 0 ? (
              <p className="text-gray-400 text-sm">در حال بارگذاری...</p>
            ) : brands.length === 0 ? (
              <p className="text-gray-400 text-sm">هنوز برندی ثبت نشده است.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {brands.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 border rounded-xl flex items-center justify-between hover:border-emerald-200 hover:bg-emerald-50/20 transition"
                  >
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">
                        {b.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        کشور: {b.country || "نامشخص"} | تعداد محصول:{" "}
                        {b.productsCount || 0}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteBrand(b.id)}
                      className="text-gray-400 hover:text-red-600 p-2 rounded-lg transition"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
