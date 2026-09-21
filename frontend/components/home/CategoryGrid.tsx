import Link from 'next/link';

const categories = [
  { title: 'حشره‌کش', slug: 'insecticides', icon: '🐛' },
  { title: 'قارچ‌کش', slug: 'fungicides', icon: '🍄' },
  { title: 'علف‌کش', slug: 'herbicides', icon: '🌿' },
  { title: 'کود شیمیایی', slug: 'chemical-fertilizers', icon: '🧪' },
  { title: 'کود آلی و ارگانیک', slug: 'organic-fertilizers', icon: '♻️' },
  { title: 'بذر و نهال', slug: 'seeds', icon: '🌱' },
];

export default function CategoryGrid() {
  return (
    <section className="container mx-auto px-4 py-14">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">دسته‌بندی محصولات</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className="bg-white rounded-xl border border-gray-100 p-5 text-center hover:border-green-500 hover:shadow-md transition"
          >
            <div className="text-4xl mb-3">{cat.icon}</div>
            <div className="text-sm font-medium text-gray-700">{cat.title}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
