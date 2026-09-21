import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🌱</span>
            <span className="font-bold text-white">آگروشاپ</span>
          </div>
          <p className="leading-7 text-gray-400">
            فروشگاه تخصصی سموم و کودهای کشاورزی با هدف تأمین نهاده‌های اصل و افزایش بهره‌وری
            مزارع ایران.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">دسترسی سریع</h4>
          <ul className="space-y-2">
            <li><Link href="/products" className="hover:text-white">محصولات</Link></li>
            <li><Link href="/blog" className="hover:text-white">مقالات آموزشی</Link></li>
            <li><Link href="/contact" className="hover:text-white">تماس با ما</Link></li>
            <li><Link href="/about" className="hover:text-white">درباره ما</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">خدمات مشتریان</h4>
          <ul className="space-y-2">
            <li><Link href="/faq" className="hover:text-white">سوالات متداول</Link></li>
            <li><Link href="/shipping" className="hover:text-white">شرایط ارسال</Link></li>
            <li><Link href="/returns" className="hover:text-white">رویه بازگشت کالا</Link></li>
            <li><Link href="/dashboard/orders" className="hover:text-white">پیگیری سفارش</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">تماس با ما</h4>
          <ul className="space-y-2 text-gray-400">
            <li>📞 ۰۲۱-۱۲۳۴۵۶۷۸</li>
            <li>📱 ۰۹۱۲۳۴۵۶۷۸۹</li>
            <li>📍 تهران، خیابان نمونه، پلاک ۱۲</li>
            <li>✉️ info@agroshop.com</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
        © ۱۴۰۵ آگروشاپ — تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
}
