// app/(admin)/admin/layout.tsx
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar - عرض ثابت */}
      <aside className="w-64 border-r bg-gray-50 p-4">
        <h2 className="mb-6 text-xl font-bold">پنل مدیریت</h2>
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
