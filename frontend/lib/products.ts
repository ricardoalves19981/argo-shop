import type { ProductDetailDto } from "@/types/product";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5079/api";

export async function getProductById(id: number): Promise<ProductDetailDto | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      cache: "no-store", // یا { next: { revalidate: 60 } } جهت کش ۱ دقیقه‌ای
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}
