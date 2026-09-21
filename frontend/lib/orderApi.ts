// src/lib/orderApi.ts

export interface CreateOrderDto {
  shippingProvince: string;
  shippingCity: string;
  shippingAddress: string;
  shippingPostalCode: string;
  receiverName: string;
  receiverPhone: string;
  paymentMethod: number;
  items: { productId: number; quantity: number }[];
}

export interface OrderItemDto {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderResponseDto {
  id: number;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  paymentMethod: string;
  paymentTrackingCode?: string;
  shippingProvince: string;
  shippingCity: string;
  shippingAddress: string;
  shippingPostalCode: string;
  receiverName: string;
  receiverPhone: string;
  items: OrderItemDto[];
}

export interface OrderItemDto {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface UserOrderDto {
  id: number;
  orderNumber: string;
  orderDate: string;
  totalAmount: number;
  isPaid: boolean;
  status: number;
  statusText: string;
  paymentTrackingCode?: string;
  receiverName: string;
  itemsCount: number;
  items: OrderItemDto[];
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5079/api";

// 1. نیازی به getAuthHeaders دستی نیست چون کوکی‌ها خودکار ارسال می‌شوند
// فقط هدرهای Content-Type را نیاز داریم
const defaultHeaders = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export async function createOrder(dto: CreateOrderDto): Promise<OrderResponseDto> {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: defaultHeaders,
    // 2. این خط حیاتی است: برای ارسال خودکار کوکی HttpOnly
    credentials: "include", 
    body: JSON.stringify(dto),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("CreateOrder failed:", res.status, text);

    try {
      const data = JSON.parse(text);
      const validationErrors =
        data?.errors
          ? Object.entries(data.errors)
              .map(([k, v]: any) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
              .join(" | ")
          : null;

      throw new Error(validationErrors || data?.title || data?.message || "خطا در ثبت سفارش");
    } catch {
      throw new Error(text || "خطا در ثبت سفارش");
    }
  }

  return res.json();
}

export async function fetchMyOrders(): Promise<UserOrderDto[]> {
  const res = await fetch("http://localhost:5000/api/orders/my-orders", {
    method: "GET",
    credentials: "include", // حیاتی برای ارسال کوکی agro-token
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("خطا در دریافت لیست سفارشات");
  }

  return res.json();
}

export async function getOrderById(id: number): Promise<OrderResponseDto> {
  const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
    headers: defaultHeaders,
    credentials: "include", // 👈 حتماً اضافه کنید
  });

  if (!res.ok) {
    throw new Error("سفارش مورد نظر یافت نمیشود");
  }

  return res.json();
}
