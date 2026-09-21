const features = [
  { icon: '🚚', title: 'ارسال سریع', desc: 'تحویل ۲۴ تا ۷۲ ساعته به سراسر کشور' },
  { icon: '✅', title: 'ضمانت اصالت کالا', desc: 'تمام محصولات دارای مجوز سازمان حفظ نباتات' },
  { icon: '👨‍🌾', title: 'مشاوره تخصصی', desc: 'پاسخ کارشناسان گیاه‌پزشکی به سوالات شما' },
  { icon: '🔒', title: 'پرداخت امن', desc: 'درگاه بانکی معتبر و امکان پرداخت در محل' },
];

export default function Features() {
  return (
    <section className="container mx-auto px-4 py-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((f) => (
          <div key={f.title} className="bg-white rounded-xl border border-gray-100 p-6 text-center">
            <div className="text-4xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-gray-800 mb-1">{f.title}</h3>
            <p className="text-xs text-gray-500 leading-6">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
