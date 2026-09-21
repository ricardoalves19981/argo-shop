// src/lib/cartApi.ts

export interface CartItemDto {
  id: number;
  productId: number;
  name: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  unit: string;
  mainImageUrl?: string;
  quantity: number;
}

export interface CartDto {
  id: number;
  userId?: string;
  guestId?: string;
  items: CartItemDto[];
  updatedAt: string;
  totalprice:number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5079/api';

// دریافت یا ساخت GuestId یکتا
export function getGuestId(): string {
  if (typeof window === 'undefined') return '';
  let guestId = localStorage.getItem('agro_guest_id');
  if (!guestId) {
    guestId = crypto.randomUUID();
    localStorage.setItem('agro_guest_id', guestId);
  }
  return guestId;
}

// ساخت هدرهای استاندارد همراه با Token و GuestId
function getHeaders(): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (typeof window !== 'undefined') {
    const guestId = getGuestId();
    if (guestId) {
      headers['X-Guest-Id'] = guestId;
    }

    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

export const cartApi = {
  async getCart(): Promise<CartDto> {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      method: 'GET',
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) {
      const errorData = await res.text();
      console.error('getCart failed:', res.status, errorData);
      throw new Error('خطا در دریافت سبد خرید');
    }
    return res.json();
  },

  async upsertItem(productId: number, quantity: number): Promise<CartDto> {
    const res = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ productId, quantity }),
    });
    if (!res.ok) {
      const errorData = await res.text();
      console.error('upsertItem failed:', res.status, errorData);
      throw new Error('خطا در بروزرسانی سبد خرید');
    }
    return res.json();
  },

  async removeItem(productId: number): Promise<CartDto> {
    const res = await fetch(`${API_BASE_URL}/cart/items/${productId}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('خطا در حذف آیتم');
    return res.json();
  },

  async clearCart(): Promise<CartDto> {
    const res = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('خطا در خالی کردن سبد خرید');
    return res.json();
  },

  async mergeCart(): Promise<CartDto> {
    const guestId = getGuestId();
    const res = await fetch(`${API_BASE_URL}/cart/merge`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ guestId }),
    });
    if (!res.ok) throw new Error('خطا در ادغام سبد خرید');
    return res.json();
  },
};
