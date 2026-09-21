'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

interface Product {
  id: number;
  name: string;
  technicalName?: string;
  category: string;
  price: number;
  oldPrice?: number;
  stockQuantity: number;
  unit: string;
  imageUrl?: string;
  brandName?: string;
  preHarvestIntervalDays?: number;
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/products', {
        params: {
          category: selectedCategory || undefined,
          search: search || undefined,
          pageSize: 20,
        },
      });
      setProducts(res.data.data);
    } catch (err) {
      console.error('خطا در دریافت لیست محصولات:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* هدر صفحه و فیلترها */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">کاتالوگ نهاده‌های کشاورزی</h1>
          <p className="text-sm text-gray-500 mt-1">
            مشاهده، مقایسه و خرید انواع سموم تخصصی و کودهای تقویتی
          </p>
        </div>

        {/* باکس جستجو */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-80">
          <input
            type="text"
            placeholder="جستجوی سم، ماده موثره یا برند..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition shrink-0"
          >
            جستجو
          </button>
        </form>
      </div>

      {/* تب‌های دسته‌بندی */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-gray-100">
        {[
          { label: 'همه محصولات', value: '' },
          { label: 'سموم کشاورزی', value: 'pesticides' },
          { label: 'کودهای شیمیایی و آلی', value: 'fertilizers' },
          { label: 'بذر و پیاز', value: 'seeds' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setSelectedCategory(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              selectedCategory === tab.value
                ? 'bg-green-700 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* نمایش لیست محصولات */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-gray-100 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <span className="text-5xl">🔍</span>
          <p className="mt-4 text-gray-600 font-medium">محصولی با مشخصات وارد شده یافت نشد.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition flex flex-col"
            >
              {/* تصویر و بج‌ها */}
              <div className="relative h-48 bg-gray-50 flex items-center justify-center p-4">
                <span className="text-6xl">📦</span>
                {p.preHarvestIntervalDays && (
                  <span className="absolute top-3 right-3 bg-amber-100 text-amber-800 text-[11px] font-semibold px-2 py-0.5 rounded-md">
                    دوره کارنس: {p.preHarvestIntervalDays} روز
                  </span>
                )}
                {p.brandName && (
                  <span className="absolute bottom-3 left-3 bg-white/80 backdrop-blur text-gray-600 text-xs px-2 py-0.5 rounded">
                    {p.brandName}
                  </span>
                )}
              </div>

              {/* مشخصات محصول */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-gray-800 text-base mb-1">{p.name}</h3>
                {p.technicalName && (
                  <p className="text-xs text-gray-400 font-mono mb-2" dir="ltr">
                    {p.technicalName}
                  </p>
                )}
                <p className="text-xs text-gray-500 mb-4">{p.unit}</p>

                <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
                  <div>
                    {p.oldPrice && (
                      <span className="block text-xs text-gray-400 line-through">
                        {p.oldPrice.toLocaleString('fa-IR')}
                      </span>
                    )}
                    <span className="font-bold text-green-700 text-base">
                      {p.price.toLocaleString('fa-IR')} <span className="text-xs">تومان</span>
                    </span>
                  </div>

                  <Link
                    href={`/products/${p.id}`}
                    className="bg-green-50 text-green-700 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                  >
                    مشاهده جزئیات
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
