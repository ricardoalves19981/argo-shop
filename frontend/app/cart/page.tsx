// src/app/cart/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const {
    items,
    totalPrice,
    totalDiscount,
    finalPrice,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading,
  } = useCart();

  if (isLoading && items.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        در حال بارگذاری سبد خرید...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold text-gray-700 mb-2">
          سبد خرید شما خالی است
        </h2>
        <p className="text-gray-500 mb-6">
          می‌توانید برای مشاهده محصولات به فروشگاه بازگردید.
        </p>
        <Link
          href="/products"
          className="inline-block bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-emerald-700 transition"
        >
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">سبد خرید</h1>
        <button
          onClick={() => clearCart()}
          className="text-sm text-red-500 hover:text-red-700"
        >
          خالی کردن سبد
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* لیست محصولات */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const activePrice = item.discountPrice ?? item.price;
            return (
              <div
                key={item.productId}
                className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                  {item.mainImageUrl ? (
                    <img
                      src={item.mainImageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      بدون تصویر
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {item.name}
                  </h3>
                  <div className="text-sm text-gray-500 mt-1">
                    واحد: {item.unit}
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="font-bold text-emerald-600">
                      {activePrice.toLocaleString()} تومان
                    </span>
                    {item.discountPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        {item.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* کنترل تعداد */}
                <div className="flex items-center gap-2 border rounded-lg p-1 bg-gray-50">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    disabled={item.quantity >= item.stockQuantity}
                    className="w-7 h-7 flex items-center justify-center font-bold bg-white rounded shadow-sm disabled:opacity-40"
                  >
                    +
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => {
                      if (item.quantity === 1) removeFromCart(item.productId);
                      else updateQuantity(item.productId, item.quantity - 1);
                    }}
                    className="w-7 h-7 flex items-center justify-center font-bold bg-white rounded shadow-sm text-red-500"
                  >
                    {item.quantity === 1 ? "✕" : "-"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* فاکتور و ادامه خرید */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b">
              خلاصه فاکتور
            </h2>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>قیمت کل محصولات:</span>
                <span>{totalPrice.toLocaleString()} تومان</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-red-500 font-medium">
                  <span>سود شما از خرید:</span>
                  <span>{totalDiscount.toLocaleString()} تومان</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between text-base font-bold text-gray-900">
                <span>مبلغ قابل پرداخت:</span>
                <span className="text-emerald-600">
                  {finalPrice.toLocaleString()} تومان
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 w-full block text-center py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition duration-200 shadow-md"
            >
              ادامه فرآیند خرید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
