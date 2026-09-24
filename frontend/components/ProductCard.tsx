// src/components/ProductCard.tsx (یا مسیر کامپوننت شما)
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ShieldAlert } from "lucide-react";

// تعریف تایپ‌های مورد نیاز
export interface ProductImage {
  id?: number | string;
  url: string;
  isMain?: boolean;
}

export interface Brand {
  id?: number | string;
  name: string;
}

export interface Category {
  id?: number | string;
  name: string;
}

export interface Product {
  id: number | string;
  name: string;
  technicalName?: string;
  price: number;
  unit: string;
  preHarvestIntervalDays?: number;
  brand?: Brand;
  category?: Category;
  images?: ProductImage[];
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // تایپ صریح و هندل کردن حالت ممکن برای خالی بودن آرایه images
  const mainImage =
    product.images?.find((img: ProductImage) => img.isMain)?.url ||
    product.images?.[0]?.url ||
    "https://placehold.co/400x400?text=No+Image";

  return (
    <Card className="h-full flex flex-col justify-between overflow-hidden hover:shadow-lg transition-shadow duration-300 border-slate-200">
      <div>
        {/* تصویر محصول */}
        <div className="relative w-full h-48 bg-slate-100">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          {product.brand && (
            <Badge className="absolute top-2 right-2 bg-emerald-800 text-white text-xs">
              {product.brand.name}
            </Badge>
          )}
          {product.preHarvestIntervalDays && (
            <Badge
              variant="destructive"
              className="absolute top-2 left-2 text-[10px] gap-1"
            >
              <ShieldAlert className="w-3 h-3" />
              کارنس: {product.preHarvestIntervalDays} روز
            </Badge>
          )}
        </div>

        {/* جزئیات محصول */}
        <CardContent className="p-4">
          <div className="text-xs text-slate-500 mb-1">
            {product.category?.name}
          </div>
          <h3 className="font-bold text-slate-800 text-base line-clamp-1 mb-1">
            {product.name}
          </h3>

          {product.technicalName && (
            <p className="text-xs text-slate-500 font-mono dir-ltr text-right mb-2 line-clamp-1">
              {product.technicalName}
            </p>
          )}

          <div className="text-xs text-slate-600 bg-emerald-50 p-2 rounded border border-emerald-100 mb-3">
            <span className="font-semibold text-emerald-800">بسته‌بندی: </span>
            {product.unit}
          </div>
        </CardContent>
      </div>

      {/* قیمت و دکمه خرید */}
      <CardFooter className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 mt-auto">
        <div>
          <div className="text-xs text-slate-400">قیمت:</div>
          <div className="font-extrabold text-emerald-700 text-lg">
            {product.price.toLocaleString("fa-IR")}{" "}
            <span className="text-xs font-normal">تومان</span>
          </div>
        </div>

        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-1">
          <ShoppingCart className="w-4 h-4" />
          خرید
        </Button>
      </CardFooter>
    </Card>
  );
}
