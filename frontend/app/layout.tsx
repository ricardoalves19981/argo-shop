import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import Providers from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgroShop | فروشگاه تخصصی نهاده‌های کشاورزی",
  description: "مرجع تخصصی خرید آنلاین کود، سم و بذر کشاورزی",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className="h-full">
      <body className="min-h-screen flex flex-col m-0 p-0 overflow-x-hidden bg-gray-50 text-gray-800">
        <Providers>
          {/* ناوبر بالا - چسبیده به عرض کامل */}
          <Navbar />

          {/* محتوای اصلی - تمام‌عرض (بدون container و بدون padding پیش‌فرض) */}
          <main className="flex-1 w-full">{children}</main>

          {/* فوتر پایین - چسبیده به عرض کامل */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
