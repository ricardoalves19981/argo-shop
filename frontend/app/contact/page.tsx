"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle,
  Sparkles,
  HelpCircle,
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject: "مشاوره خرید کود و سم",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // شبیه‌سازی ارسال به بک‌اند یا API
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: "",
        phone: "",
        subject: "مشاوره خرید کود و سم",
        message: "",
      });

      setTimeout(() => setIsSuccess(false), 5000);
    }, 1200);
  };

  const contactCards = [
    {
      icon: Phone,
      title: "تماس تلفنی با پشتیبانی",
      details: "۰۲۱-۱۲۳۴۵۶۷۸",
      subDetail: "پاسخگویی سریع در ساعات اداری",
      actionText: "تماس مستقیم",
      href: "tel:02112345678",
      color: "from-emerald-500 to-teal-600",
    },
    {
      icon: MessageSquare,
      title: "مشاوره گیاه‌پزشکی (واتس‌اپ)",
      details: "۰۹۱۲۳۴۵۶۷۸۹",
      subDetail: "ارسال تصویر آفات و بیماری‌های گیاهی",
      actionText: "ارسال پیام در واتس‌اپ",
      href: "https://wa.me/989123456789",
      color: "from-emerald-600 to-green-700",
    },
    {
      icon: Mail,
      title: "پشتیبانی ایمیلی و سازمانی",
      details: "support@agroshop.ir",
      subDetail: "جهت سفارشات عمده و استعلام قیمت",
      actionText: "ارسال ایمیل",
      href: "mailto:support@agroshop.ir",
      color: "from-teal-600 to-cyan-700",
    },
    {
      icon: Clock,
      title: "ساعات کاری و پاسخ‌گویی",
      details: "شنبه تا چهارشنبه: ۸:۳۰ الی ۱۸:۰۰",
      subDetail: "پنجشنبه‌ها: ۸:۳۰ الی ۱۳:۳۰",
      actionText: "روزهای تعطیل پاسخگویی واتس‌اپ فعال است",
      href: "#",
      color: "from-slate-700 to-slate-900",
    },
  ];

  const faqs = [
    {
      q: "چگونه می‌توانم از کارشناسان ارشد آگروشاپ مشاوره آفات و گیاه‌پزشکی بگیرم؟",
      a: "کافیست از طریق واتس‌اپ یا فرم تماس، تصویر برگ، میوه یا خاک آلوده به همراه مشخصات محصول و مساحت زمین را ارسال کنید تا کارشناسان ما نسخه مناسب را ارائه دهند.",
    },
    {
      q: "نحوه و زمان ارسال سفارشات بذر و تجهیزات چگونه است؟",
      a: "سفارشات تهران از طریق پیک و ظرف کمتر از ۲۴ ساعت و سفارشات شهرستان‌ها از طریق تیپاکس و پست ویژه ظرف ۲ الی ۳ روز کاری ارسال و تحویل می‌گردند.",
    },
    {
      q: "آیا امکان خرید حضوری یا سفارش عمده برای تعاونی‌ها وجود دارد؟",
      a: "بله، برای خریدهای تناژی و همکاری‌های سازمانی، می‌توانید با واحد فروش سازمانی ما تماس حاصل فرمایید.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      {/* هدر صفحه */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-950 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-emerald-800/60 border border-emerald-500/30 px-4 py-1 rounded-full text-emerald-200 text-xs sm:text-sm font-medium mb-4 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            ما همواره آماده شنیدن صدای گرم شما هستیم
          </span>
          <h1 className="text-3xl sm:text-5xl font-black mb-4">
            تماس با متخصصین آگروشاپ
          </h1>
          <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            پیش از خرید بذر، کود یا سم، در خصوص انتخاب مناسب‌ترین ترکیب با
            کارشناسان ما در ارتباط باشید.
          </p>
        </div>
      </section>

      {/* کارت‌های اطلاعات تماس سریع */}
      <section className="max-w-6xl mx-auto -mt-8 px-4 sm:px-6 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactCards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col justify-between hover:translate-y-[-2px] transition-transform duration-200"
            >
              <div>
                <div
                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center mb-4 shadow-md`}
                >
                  <card.icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-800 mb-1">
                  {card.title}
                </h3>
                <p className="text-base font-extrabold text-emerald-700 dir-ltr text-right mb-1">
                  {card.details}
                </p>
                <p className="text-xs text-slate-500 mb-4">{card.subDetail}</p>
              </div>
              {card.href !== "#" && (
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 mt-2 pt-3 border-t border-slate-100"
                >
                  <span>{card.actionText}</span>
                  <span className="text-xs">←</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* بخش فرم تماس و اطلاعات آدرس */}
      <section className="max-w-6xl mx-auto mt-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* فرم ارسال پیام */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                ارسال پیام یا درخواست مشاوره
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                اطلاعات خود را وارد کنید، کارشناسان ما ظرف حداکثر ۴ ساعت با شما
                تماس می‌گیرند.
              </p>
            </div>

            {isSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-800">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-sm font-medium">
                  پیام شما با موفقیت ثبت شد. به‌زودی با شما تماس خواهیم گرفت.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    نام و نام خانوادگی *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="مثال: علی کشاورز"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    شماره همراه *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition text-right dir-ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  موضوع پیام
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                >
                  <option value="مشاوره خرید کود و سم">
                    مشاوره خرید کود و سم
                  </option>
                  <option value="پیگیری وضعیت سفارش">پیگیری وضعیت سفارش</option>
                  <option value="استعلام قیمت و خرید عمده">
                    استعلام قیمت و خرید عمده
                  </option>
                  <option value="پیشنهاد یا انتقاد">
                    پیشنهاد، انتقاد یا سایر موارد
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  متن پیام *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="توضیحات مربوط به متراژ زمین، نوع آفت یا ابزار مورد نیاز را بنویسید..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-700/20 transition duration-200 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>در حال ارسال...</span>
                ) : (
                  <>
                    <span>ارسال پیام</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* آدرس دفتر و نقشه */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <div className="flex items-center gap-2.5 text-emerald-800 font-bold mb-3">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>دفتر مرکزی و انبار توزیع</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                تهران، خیابان آزادی، تقاطع شادمان، مجتمع تجاری کشاورزی نگین،
                طبقه ۲، واحد ۱۰
              </p>
              <div className="text-xs text-slate-500 space-y-1">
                <p>کد پستی: ۱۴۵۸۷۹۶۳۲۱</p>
                <p>امکان بازدید حضوری با هماهنگی قبلی امکان‌پذیر است.</p>
              </div>
            </div>

            {/* پیش‌نمایش گرافیکی نقشه */}
            <div className="bg-slate-200 rounded-2xl h-60 sm:h-64 overflow-hidden relative border border-slate-300 flex items-center justify-center group shadow-inner">
              <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center p-6 text-center">
                <MapPin className="w-10 h-10 text-emerald-600 animate-bounce mb-2" />
                <p className="text-sm font-bold text-slate-800">
                  موقعیت دفتر مرکزی روی نقشه
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  جهت مسیریابی از طریق نشان یا بلد کلیک فرمایید
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition"
                >
                  مشاهده در گوگل مپ
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* بخش سوالات متداول (FAQ) */}
      <section className="max-w-4xl mx-auto mt-20 px-4 sm:px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>پاسخ به سوالات پرتکرار</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            شاید سوال شما هم باشد
          </h2>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm"
            >
              <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-2">
                {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
