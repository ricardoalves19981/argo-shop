import Link from 'next/link';

export default function Hero() {
  return (
    <section className="bg-gradient-to-l from-green-700 to-green-500 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-block bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs mb-4">
            ارسال به سراسر ایران 🇮🇷
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
            سم و کود اصل، <br />
            مستقیم از نمایندگی
          </h1>
          <p className="text-green-50/90 leading-8 mb-8 max-w-lg">
            سموم کشاورزی و کودهای شیمیایی و آلی با ضمانت اصالت کالا، مشاوره رایگان کارشناسان
            گیاه‌پزشکی و ارسال سریع به مزرعه شما.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/products"
              className="bg-white text-green-700 font-semibold px-6 py-3 rounded-lg hover:bg-green-50 transition"
            >
              مشاهده محصولات
            </Link>
            <Link
              href="/contact"
              className="border border-white/60 px-6 py-3 rounded-lg hover:bg-white/10 transition"
            >
              مشاوره رایگان کشاورزی
            </Link>
          </div>
        </div>

        <div className="hidden md:flex justify-center">
          <div className="w-72 h-72 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-[9rem]">
            🌾
          </div>
        </div>
      </div>
    </section>
  );
}
