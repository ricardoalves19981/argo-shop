"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sprout,
  ShieldCheck,
  Truck,
  Headphones,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Search,
  CheckCircle2,
  Tag,
} from "lucide-react";

interface SlideData {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  discountBadge?: string;
  bgGradient: string;
  accentColor: string;
  btnText: string;
  btnLink: string;
  tagline: string;
  icon: string;
}

const carouselSlides: SlideData[] = [
  {
    id: 1,
    badge: "جشنواره کاشت فصلی",
    title: "کودهای تخصصی NPK و محرک رشد",
    subtitle:
      "فرمولاسیون غنی‌شده جهت افزایش گل‌دهی و مقاومت ریشه در برابر تنش‌های محیطی و کم‌آبی",
    discountBadge: "تا ۲۵٪ تخفیف",
    bgGradient: "from-emerald-900 via-teal-900 to-slate-900",
    accentColor: "text-emerald-400",
    btnText: "مشاهده کودهای تقویت‌کننده",
    btnLink: "/products?category=fertilizers",
    tagline: "دارای گواهی ثبت ماده کودی جهاد کشاورزی",
    icon: "🌱",
  },
  {
    id: 2,
    badge: "دفع تضمینی آفات",
    title: "سموم حشره‌کش و قارچ‌کش‌های استاندارد",
    subtitle:
      "محافظت حداکثری از باغات و مزارع با حداقل دوره کارنس و اثربخشی سریع",
    discountBadge: "ارسال رایگان سفارشات عمده",
    bgGradient: "from-teal-950 via-cyan-950 to-slate-900",
    accentColor: "text-cyan-400",
    btnText: "خرید سموم زراعی و بهداشتی",
    btnLink: "/products?category=pesticides",
    tagline: "تایید شده توسط سازمان حفظ نباتات",
    icon: "🧪",
  },
  {
    id: 3,
    badge: "بذرهای اصلاح‌شده F1",
    title: "بذر صیفی‌جات و سبزیجات پرمحصول",
    subtitle:
      "قوه نامیه بالای ۹۵٪، مقاومت ژنتیکی به بیماری‌ها و بازدهی چندبرابری محصول",
    discountBadge: "تنوع وارداتی و داخلی",
    bgGradient: "from-green-950 via-emerald-950 to-slate-900",
    accentColor: "text-green-400",
    btnText: "بررسی کاتالوگ بذرها",
    btnLink: "/products?category=seeds",
    tagline: "تضمین اصالت تاریخ انقضا و خلوص ژنتیکی",
    icon: "🌾",
  },
];

export default function HeroSplitCarousel() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const SLIDE_DURATION = 5000; // ۵ ثانیه
  const INTERVAL_STEP = 50; // آپدیت پیشرفت هر ۵۰ میلی‌ثانیه

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % carouselSlides.length);
    setProgress(0);
  };

  const prevSlide = () => {
    setCurrent(
      (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length,
    );
    setProgress(0);
  };

  // مدیریت هوشمند نوار پیشرفت و تعویض اسلاید بدون نیاز به CSS اختصاصی
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          nextSlide();
          return 0;
        }
        return oldProgress + (INTERVAL_STEP / SLIDE_DURATION) * 100;
      });
    }, INTERVAL_STEP);

    return () => clearInterval(timer);
  }, [isPaused, current]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden border-b border-slate-800/80">
      {/* پترن پس‌زمینه نقطه ای */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      {/* هاله‌های رنگی نور */}
      <div className="absolute -top-32 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 left-10 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* ================= ستون راست: متن اصلی و جستجو ================= */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-right">
            <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-emerald-400 text-xs sm:text-sm font-medium backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>فروشگاه تخصصی نهاده‌ها و ادوات کشاورزی</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
              سم و کود اصل، <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 via-teal-300 to-green-400">
                مستقیم از نمایندگی رسمی
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
              تأمین انواع کودهای مغذی، بذر هیبرید و ادوات باغبانی به همراه
              <span className="text-emerald-300 font-semibold">
                {" "}
                مشاوره رایگان گیاه‌پزشکی{" "}
              </span>
              و تضمین بالاترین کیفیت و تاریخ مصرف معتبر.
            </p>

            {/* جستجوی سریع */}
            <form
              onSubmit={handleSearch}
              className="max-w-lg mx-auto lg:mx-0 relative"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی سم، کود، رقم بذر (مثلاً: کود فسفر بالا)..."
                className="w-full bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm rounded-xl pr-10 pl-24 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-4" />
              <button
                type="submit"
                className="absolute left-2 top-2 bottom-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 rounded-lg transition duration-200"
              >
                جستجو
              </button>
            </form>

            {/* دکمه‌های فراخوان (CTA) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 transition duration-200 text-xs sm:text-sm"
              >
                <span>مشاهده محصولات</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-5 py-3.5 rounded-xl text-xs sm:text-sm font-medium transition duration-200"
              >
                <Headphones className="w-4 h-4 text-emerald-400" />
                <span>مشاوره گیاه‌پزشکی</span>
              </Link>
            </div>
          </div>

          {/* ================= ستون چپ: CAROUSEL تعاملی ================= */}
          <div
            className="lg:col-span-6 relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative rounded-3xl p-1 bg-gradient-to-b from-slate-700/60 to-slate-800/20 shadow-2xl backdrop-blur-sm">
              <div className="relative h-[340px] sm:h-[370px] rounded-[22px] overflow-hidden">
                {carouselSlides.map((slide, index) => {
                  const isActive = index === current;
                  return (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 bg-gradient-to-br ${slide.bgGradient} p-6 sm:p-8 flex flex-col justify-between transition-all duration-700 ease-out ${
                        isActive
                          ? "opacity-100 scale-100 pointer-events-auto z-10"
                          : "opacity-0 scale-95 pointer-events-none z-0"
                      }`}
                    >
                      {/* بالای اسلاید */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="bg-white/10 border border-white/20 text-slate-100 text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-md">
                            {slide.badge}
                          </span>
                          {slide.discountBadge && (
                            <span className="inline-flex items-center gap-1 bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full">
                              <Tag className="w-3 h-3" />
                              <span>{slide.discountBadge}</span>
                            </span>
                          )}
                        </div>
                        <div className="text-4xl sm:text-5xl select-none">
                          {slide.icon}
                        </div>
                      </div>

                      {/* متن اصلی اسلاید */}
                      <div className="space-y-3 my-auto">
                        <h2
                          className={`text-xl sm:text-2xl font-black leading-snug ${slide.accentColor}`}
                        >
                          {slide.title}
                        </h2>
                        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                          {slide.subtitle}
                        </p>
                        <div className="flex items-center gap-2 text-slate-300 text-xs pt-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{slide.tagline}</span>
                        </div>
                      </div>

                      {/* دکمه اسلاید */}
                      <div className="pt-2">
                        <Link
                          href={slide.btnLink}
                          className="inline-flex items-center gap-2 bg-white text-slate-950 hover:bg-slate-100 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition duration-200"
                        >
                          <span>{slide.btnText}</span>
                          <ArrowLeft className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  );
                })}

                {/* دکمه‌های جلو / عقب */}
                <button
                  onClick={prevSlide}
                  aria-label="قبلی"
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="بعدی"
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center backdrop-blur-md border border-white/10 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* خط Progress زمان‌دار با style درون‌خطی */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all duration-75 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* نشانگرها (Dots) و شمارنده */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 rounded-b-2xl">
                <div className="flex items-center gap-2">
                  {carouselSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrent(idx);
                        setProgress(0);
                      }}
                      aria-label={`اسلاید ${idx + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === current
                          ? "w-7 bg-emerald-400"
                          : "w-2 bg-slate-600 hover:bg-slate-500"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  {current + 1} از {carouselSlides.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= نوار مزیت‌های اعتمادساز ================= */}
      <div className="border-t border-slate-800/80 bg-slate-900/50 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-right">
                <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                  ضمانت اصالت ۱۰۰٪
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  تاییدیه جهاد کشاورزی
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="text-right">
                <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                  مشاوره گیاه‌پزشکی
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  بررسی تخصصی آفات و مزارع
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-right">
                <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                  ارسال سریع و مطمئن
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  بسته‌بندی استاندارد به کل ایران
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 shrink-0">
                <Sprout className="w-5 h-5" />
              </div>
              <div className="text-right">
                <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                  تنوع بذر و ادوات
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  مستقیم از نمایندگی رسمی
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
