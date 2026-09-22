// // app/(admin)/admin/products/page.tsx
// import { cookies } from "next/headers";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { PlusCircle } from "lucide-react";
// import Link from "next/link";

// async function getProducts() {
//   const cookieStore = await cookies();
//   const token = cookieStore.get("agro_token")?.value;

//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//     cache: "no-store", // همیشه دیتای تازه بگیر
//   });

//   if (!res.ok) throw new Error("خطا در دریافت لیست محصولات");
//   return res.json();
// }

// export default async function AdminProductsPage() {
//   const products = await getProducts();

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">مدیریت محصولات</h1>
//         <Button asChild>
//           <Link href="/admin/products/new">
//             <PlusCircle className="mr-2 h-4 w-4" />
//             افزودن محصول جدید
//           </Link>
//         </Button>
//       </div>

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>نام محصول</TableHead>
//               <TableHead>دسته‌بندی</TableHead>
//               <TableHead>قیمت (تومان)</TableHead>
//               <TableHead>موجودی</TableHead>
//               <TableHead>وضعیت</TableHead>
//               <TableHead className="text-right">عملیات</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {products.map((product: any) => (
//               <TableRow key={product.id}>
//                 <TableCell className="font-medium">{product.name}</TableCell>
//                 <TableCell>{product.categoryName}</TableCell>
//                 <TableCell>{product.price.toLocaleString("fa-IR")}</TableCell>
//                 <TableCell>{product.stockQuantity}</TableCell>
//                 <TableCell>
//                   <span
//                     className={
//                       product.isActive ? "text-green-600" : "text-red-600"
//                     }
//                   >
//                     {product.isActive ? "فعال" : "غیرفعال"}
//                   </span>
//                 </TableCell>
//                 <TableCell className="text-right">
//                   <div className="flex justify-end gap-2">
//                     <Button variant="outline" size="sm" asChild>
//                       <Link href={`/admin/products/edit/${product.id}`}>
//                         ویرایش
//                       </Link>
//                     </Button>
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// }
// app/(admin)/admin/products/page.tsx
import { cookies } from "next/headers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

async function getProducts() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("agro_token")?.value;
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5079/api";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${apiUrl}/products`, {
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(
        "خطا در پاسخ سرور برای محصولات:",
        res.status,
        res.statusText,
      );
      return [];
    }

    const data = await res.json();

    // پشتیبانی هم از آرایه مستقیم و هم از خروجی‌های پیجینیشن (items یا data)
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.data)) return data.data;

    return [];
  } catch (error) {
    console.error("خطا در واکشی محصولات:", error);
    return [];
  }
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">مدیریت محصولات</h1>
        <Button asChild>
          <Link href="/admin/products/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            افزودن محصول جدید
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>نام محصول</TableHead>
              <TableHead>دسته‌بندی</TableHead>
              <TableHead>قیمت (تومان)</TableHead>
              <TableHead>موجودی</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead className="text-right">عملیات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length > 0 ? (
              products.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {product.categoryName || product.category?.name || "—"}
                  </TableCell>
                  <TableCell>
                    {product.price != null
                      ? Number(product.price).toLocaleString("fa-IR")
                      : "۰"}
                  </TableCell>
                  <TableCell>
                    {product.stockQuantity ?? product.stock ?? 0}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        product.isActive ? "text-green-600" : "text-red-600"
                      }
                    >
                      {product.isActive ? "فعال" : "غیرفعال"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/products/edit/${product.id}`}>
                          ویرایش
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  هیچ محصولی یافت نشد.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
