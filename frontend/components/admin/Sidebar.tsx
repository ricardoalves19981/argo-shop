// components/admin/Sidebar.tsx
import Link from "next/link";

export default function Sidebar() {
  const menuItems = [
    { name: "داشبورد", path: "/admin" },
    { name: "محصولات", path: "/admin/products" },
    { name: "سفارش‌ها", path: "/admin/orders" },
    { name: "کاربران", path: "/admin/users" },
  ];

  return (
    <nav className="flex flex-col gap-2">
      {menuItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className="rounded-lg p-2 hover:bg-gray-200 transition"
        >
          {item.name}
        </Link>
      ))}
      <div className="mt-auto pt-10">
        <Link href="/" className="text-red-600">
          خروج به سایت
        </Link>
      </div>
    </nav>
  );
}
