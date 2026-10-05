import React from "react";
import Link from "next/link";
import {
  Sprout,
  ShieldCheck,
  Truck,
  Headphones,
  Award,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

export const metadata = {
  title: "درباره ما | فروشگاه کشاورزی آگروشاپ",
  description:
    "آشنایی با تاریخچه، اهداف، ارزش‌ها و تیم تخصصی فروشگاه ادوات، کود و بذر کشاورزی آگروشاپ",
};

export default function AboutPage() {
  const stats = [
    { label: "مشتری و کشاورز راضی", value: "+۱۵,۰۰۰" },
    { label: "تنوع کالا و بذر اصیل", value: "+۱,۲۰۰" },
    { label: "سال سابقه تخصصی", value: "۱۰+" },
    { label: "شهر تحت پوشش ارسال", value: "۳۱ استان" },
  ];

  const features = [
    {
      icon: ShieldCheck,
      title: "ضمانت اصالت ۱۰۰٪ کالا",
      desc: "تضمین اصالت تمامی بذرها، سموم، کودها و ابزارآلات با ارائه سرتیفیکیت و تاییدیه رسمی جهاد کشاورزی.",
    },
    {
      icon: Headphones,
      title: "مشاوره رایگان گیاه‌پزشکی",
      desc: "تیم کارشناسان ارشد کشاورزی ما قبل از خرید برای انتخاب بهترین نهاده‌ها در کنار شما هستند.",
    },
    {
      icon: Truck,
      title: "ارسال سریع و ایمن",
      desc: "بسته‌بندی تخصصی متناسب با شرایط دمایی و حساسیت بذرها و ارسال فوری به سراسر کشور.",
    },
    {
      icon: Award,
      title: "قیمت مستقیم و منصفانه",
      desc: "حذف واسطه‌ها و واردات و تامین مستقیم از برترین برندهای داخلی و بین‌المللی با بهترین قیمت.",
    },
  ];

  const values = [
    "توسعه کشاورزی پایدار و حفاظت از منابع آب و خاک کشور",
    "تامین پیشرفته‌ترین ابزارآلات باغبانی و اتوماسیون آبیاری",
    "صداقت در مشاوره فنی و معرفی بهترین راهکارهای دفع آفات",
    "پشتیبانی مستمر از کشاورزان تا مرحله برداشت محصول",
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* هدر بالایی و بنر معرفی (Hero Section) */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-700/50 border border-emerald-500/30 px-4 py-1.5 rounded-full text-emerald-200 text-sm font-medium mb-6 backdrop-blur-sm">
            <Sprout className="w-4 h-4 text-emerald-400" />
            <span>همراه مطمئن خاک و مزرعه شما</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-snug sm:leading-tight mb-6 text-white">
            روایتی از عشق به طبیعت، خاک و{" "}
            <span className="text-emerald-400">توسعه کشاورزی مدرن</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-emerald-100/90 leading-relaxed">
            ما در <strong>آگروشاپ</strong>، مأموریت خود را اتصال دانش روز
            باغبانی به دل مزارع و باغ‌ها قرار داده‌ایم تا کیفیت و باروری محصول
            شما تضمین شود.
          </p>
        </div>
      </section>

      {/* بخش آمار و ارقام کلیدی */}
      <section className="max-w-6xl mx-auto -mt-10 px-4 sm:px-6 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-6 border border-slate-100">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center p-3 sm:p-4">
              <div className="text-2xl sm:text-4xl font-extrabold text-emerald-700 font-sans tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500 mt-2">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* داستان ما / درباره ما */}
      <section className="max-w-6xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-emerald-700 font-bold text-sm tracking-wider uppercase">
              <TrendingUp className="w-4 h-4" />
              <span>داستان شکل‌گیری آگروشاپ</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
              از یک دغدغه ساده تا بزرگ‌ترین مرجع آنلاین ملزومات کشاورزی
            </h2>

            <p className="text-slate-600 leading-relaxed text-justify">
              <strong>آگروشاپ</strong> از سال ۱۳۹۵ با تیمی از دانش‌آموختگان
              رشته‌های گیاه‌پزشکی و مهندسی زراعت آغاز به کار کرد. چالش همیشگی
              کشاورزان، دسترسی به نهاده‌ها و ادوات باکیفیت و اصل با قیمت عادلانه
              بود.
            </p>

            <p className="text-slate-600 leading-relaxed text-justify">
              ما تصمیم گرفتیم پلی مستقیم میان تولیدکنندگان تراز اول جهان و
              باغداران و کشاورزان پرتلاش ایرانی باشیم. امروز آگروشاپ نه تنها یک
              فروشگاه، بلکه مرجعی برای مشاوره، انتخاب آگاهانه سموم و کودهای
              ارگانیک و تجهیزات نوین آبیاری است.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {values.map((val, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-sm text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl opacity-20 blur-xl"></div>

              <div className="relative bg-white rounded-2xl p-8 border border-slate-100 shadow-xl space-y-6">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  چشم‌انداز و تعهد ما
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  ما متعهدیم که هیچ کشاورزی به دلیل استفاده از نهاده‌های
                  بی‌کیفیت یا عدم دسترسی به مشاور دلسوز، متضرر نشود. هدف ما
                  ارتقای بهره‌وری در هر هکتار از مزارع ایران است.
                </p>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-400">
                    تیم فنی و مدیریت بازرگانی آگروشاپ
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* چرا آگروشاپ؟ (ویژگی‌ها) */}
      <section className="max-w-6xl mx-auto mt-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
            چرا کشاورزان به آگروشاپ اعتماد دارند؟
          </h2>
          <p className="text-slate-500 text-sm sm:text-base">
            تمایز ما در کیفیت بی‌قیدوشرط، تخصص فنی و ارسال سریع است.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 flex flex-col items-center text-center group"
            >
              <div className="w-14 h-14 bg-emerald-50 group-hover:bg-emerald-600 text-emerald-700 group-hover:text-white rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300">
                <item.icon className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2.5">
                {item.title}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* بخش بنر دعوت به خرید / کاتالوگ محصولات */}
      <section className="max-w-6xl mx-auto mt-20 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 text-center md:text-right">
            <h3 className="text-2xl sm:text-3xl font-black">
              آماده‌اید به مزارع و باغ‌های خود جان دوباره ببخشید؟
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base max-w-xl">
              تنوع محصولات و تخفیف‌های ویژه فصلی بذرها، کودها و تجهیزات کشاورزی
              را بررسی کنید.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-emerald-900 hover:bg-emerald-50 px-7 py-3.5 rounded-xl font-bold shadow-lg transition duration-200 shrink-0"
          >
            <span>مشاهده فروشگاه و خرید</span>
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
