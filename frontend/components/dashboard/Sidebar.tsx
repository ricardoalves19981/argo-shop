import Link from 'next/link';
import { LayoutDashboard, ShoppingBag, Users, Settings } from 'lucide-react';

export const Sidebar = ({ isAdmin }: { isAdmin: boolean }) => {
  const menuItems = isAdmin 
    ? [
        { name: 'آمار کلی', href: '/admin', icon: LayoutDashboard },
        { name: 'مدیریت محصولات', href: '/admin/products', icon: ShoppingBag },
        { name: 'کاربران', href: '/admin/users', icon: Users },
      ]
    : [
        { name: 'سفارشات من', href: '/user/orders', icon: ShoppingBag },
        { name: 'پروفایل', href: '/user/profile', icon: Settings },
      ];

  return (
    <aside className="w-64 bg-white h-screen border-l p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 p-3 hover:bg-green-50 rounded-lg transition-colors text-slate-700">
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
