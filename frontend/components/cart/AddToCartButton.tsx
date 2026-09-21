// src/components/cart/AddToCartButton.tsx
"use client";

import React from "react";
import { useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
  productId: number;
  stockQuantity: number;
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  stockQuantity,
}) => {
  const { items, addToCart, updateQuantity, removeFromCart, isLoading } =
    useCart();
  const currentItem = items.find((i) => i.productId === productId);
  const currentQty = currentItem?.quantity || 0;

  if (stockQuantity <= 0) {
    return (
      <button
        disabled
        className="w-full py-3 px-6 rounded-xl bg-gray-200 text-gray-500 cursor-not-allowed font-medium"
      >
        ناموجود
      </button>
    );
  }

  if (currentQty === 0) {
    return (
      <button
        onClick={() => addToCart(productId, 1)}
        disabled={isLoading}
        className="w-full py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition duration-200 shadow-md flex items-center justify-center gap-2"
      >
        <span>افزودن به سبد خرید</span>
      </button>
    );
  }

  return (
    <div className="flex items-center justify-between border-2 border-emerald-600 rounded-xl p-1 bg-white">
      <button
        onClick={() => {
          if (currentQty < stockQuantity) {
            updateQuantity(productId, currentQty + 1);
          }
        }}
        disabled={currentQty >= stockQuantity || isLoading}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 disabled:opacity-40"
      >
        +
      </button>

      <div className="flex flex-col items-center px-4">
        <span className="font-bold text-gray-800 text-lg">{currentQty}</span>
        {currentQty >= stockQuantity && (
          <span className="text-[10px] text-amber-600">حداکثر موجودی</span>
        )}
      </div>

      <button
        onClick={() => {
          if (currentQty === 1) {
            removeFromCart(productId);
          } else {
            updateQuantity(productId, currentQty - 1);
          }
        }}
        disabled={isLoading}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 text-red-600 font-bold hover:bg-red-100"
      >
        {currentQty === 1 ? "🗑" : "-"}
      </button>
    </div>
  );
};
