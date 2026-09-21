import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  unit: string;
  icon: string;
  inStock: boolean;
}

const products: Product[] = [
  {
    id: 1,
    name: 'سم حشره‌کش کنفیدور',
    price: 850000,
    oldPrice: 920000,
    unit: 'بطری ۲۵۰ میلی‌لیتر',
    icon: '🧴',
    inStock: true,
  },
  {
    id: 2,
    name: 'کود اوره ۴۶٪',
    price: 1250000,
    unit: 'کیسه ۵۰ کیلوگرمی',
    icon: '🧂',
    inStock: true,
  },
  {
    id: 3,
    name: 'قارچ‌کش مانکوزب',
    price: 640000,
    unit: 'بسته ۱ کیلوگرمی',
    icon: '🍄',
    inStock: true,
  },
  {
    id: 4,
    name: 'کود آلی مایع هیومیک',
    price: 480000,
    oldPrice: 550000,
    unit: 'بطری ۱ لیتری',
    icon: '♻️',
    inStock: false,
  },
];

function formatPrice(value: number) {
  return `${new Intl.NumberFormat('fa-IR').format(value)} تومان`;
}

export default function FeaturedProducts() {
  return (
    <section className="bg-white py-14">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 md:text-2xl">
            پرفروش‌ترین‌ها
          </h2>

          <Link href="/products" className="text-sm text-green-700 hover:underline">
            مشاهده همه
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="flex flex-col rounded-lg border border-gray-100 p-4 transition-shadow hover:shadow-md"
            >
              <div className="mb-4 flex h-40 items-center justify-center rounded-lg bg-gray-50 text-6xl">
                {product.icon}
              </div>

              <h3 className="mb-2 font-medium leading-7 text-gray-800">
                {product.name}
              </h3>

              <p className="mb-3 text-xs text-gray-500">{product.unit}</p>

              <div className="mt-auto">
                {product.oldPrice !== undefined && (
                  <p className="mb-1 text-xs text-gray-400 line-through">
                    {formatPrice(product.oldPrice)}
                  </p>
                )}

                <p className="mb-3 font-bold text-green-700">
                  {formatPrice(product.price)}
                </p>

                <button
                  type="button"
                  disabled={!product.inStock}
                  className="w-full rounded-lg bg-green-600 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
                >
                  {product.inStock ? 'افزودن به سبد خرید' : 'ناموجود'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
