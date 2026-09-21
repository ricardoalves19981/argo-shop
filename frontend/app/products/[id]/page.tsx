import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import ProductGallery from "@/components/products/ProductGallery";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

type PageProps = {
  params: Promise<{ id: string }>;
};

function formatPriceToman(value: number) {
  return new Intl.NumberFormat("fa-IR").format(value) + " تومان";
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (isNaN(id)) {
    notFound();
  }

  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  const finalPrice = product.discountPrice ?? product.price;
  const hasDiscount =
    product.discountPrice != null && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.price - product.discountPrice!) / product.price) * 100,
      )
    : 0;

  const allImages =
    product.imageUrls && product.imageUrls.length > 0
      ? product.imageUrls
      : product.mainImageUrl
        ? [product.mainImageUrl]
        : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* بخش تصاویر (۵ ستون) */}
        <div className="lg:col-span-5">
          <ProductGallery title={product.name} images={allImages} />
        </div>

        {/* بخش اطلاعات و خرید (۷ ستون) */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>{product.categoryName}</span>
              {product.brandName && (
                <>
                  <span>•</span>
                  <span>برند: {product.brandName}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl font-black text-gray-900 md:text-3xl">
              {product.name}
            </h1>
            {product.technicalName && (
              <p className="mt-1 text-sm font-medium text-emerald-800">
                {product.technicalName}
              </p>
            )}
          </div>

          {/* باکس قیمت و موجودی */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-xs text-gray-500">قیمت مصرف‌کننده:</div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-gray-900">
                    {formatPriceToman(finalPrice)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-sm text-gray-400 line-through">
                        {formatPriceToman(product.price)}
                      </span>
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                        %{discountPercent}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="text-left">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    product.stockQuantity > 0
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      product.stockQuantity > 0
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    }`}
                  />
                  {product.stockQuantity > 0
                    ? `موجود در انبار (${product.stockQuantity} ${product.unit})`
                    : "ناموجود"}
                </span>
              </div>
            </div>

            {/* جایگزینی با کامپوننت هوشمند سبد خرید */}
            <div className="mt-6">
              <AddToCartButton
                productId={product.id}
                stockQuantity={product.stockQuantity}
              />
            </div>
          </div>

          {/* توضیحات محصول */}
          {product.description && (
            <div>
              <h2 className="text-lg font-bold text-gray-900">معرفی محصول</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600">
                {product.description}
              </p>
            </div>
          )}

          {/* مشخصات تخصصی سم و کود */}
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              مشخصات فنی و کاربرد
            </h2>
            <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {product.activeIngredient && (
                <SpecItem label="ماده موثره" value={product.activeIngredient} />
              )}
              {product.formulation && (
                <SpecItem label="نوع فرمولاسیون" value={product.formulation} />
              )}
              {product.preHarvestIntervalDays != null && (
                <SpecItem
                  label="دوره کارنس (فاصله تا برداشت)"
                  value={`${product.preHarvestIntervalDays} روز`}
                />
              )}
              {product.registrationCode && (
                <SpecItem
                  label="کد ثبت حفظ نباتات"
                  value={product.registrationCode}
                />
              )}
              {product.targetPests && (
                <div className="sm:col-span-2">
                  <SpecItem
                    label="آفات / بیماری‌های هدف"
                    value={product.targetPests}
                  />
                </div>
              )}
              {product.suitableCrops && (
                <div className="sm:col-span-2">
                  <SpecItem label="محصولات هدف" value={product.suitableCrops} />
                </div>
              )}
              {product.usageInstruction && (
                <div className="sm:col-span-2">
                  <SpecItem
                    label="دستور و دوز مصرف"
                    value={product.usageInstruction}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpecItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col rounded-xl border border-gray-100 bg-gray-50 p-3">
      <span className="text-xs font-medium text-gray-500">{label}</span>
      <span className="mt-1 text-sm font-semibold text-gray-800">{value}</span>
    </div>
  );
}
