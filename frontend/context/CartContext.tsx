// src/context/CartContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { cartApi, CartDto, CartItemDto } from "@/lib/cartApi";

interface CartContextType {
  cart: CartDto | null;
  items: CartItemDto[];
  isLoading: boolean;
  totalCount: number;
  totalPrice: number;
  totalDiscount: number;
  finalPrice: number;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [, startTransition] = useTransition();

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const data = await cartApi.getCart();
      setCart(data);
    } catch (err) {
      console.error("Fetch cart error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const items = cart?.items || [];
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // محاسبات فاکتور
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const finalPrice = items.reduce(
    (sum, item) => sum + (item.discountPrice ?? item.price) * item.quantity,
    0,
  );
  const totalDiscount = totalPrice - finalPrice;

  const updateQuantity = async (productId: number, quantity: number) => {
    startTransition(async () => {
      try {
        const updated = await cartApi.upsertItem(productId, quantity);
        setCart(updated);
      } catch (err) {
        console.error("Update item error:", err);
      }
    });
  };

  const addToCart = async (productId: number, quantity = 1) => {
    const existing = items.find((i) => i.productId === productId);
    const newQty = (existing?.quantity || 0) + quantity;
    await updateQuantity(productId, newQty);
  };

  const removeFromCart = async (productId: number) => {
    startTransition(async () => {
      try {
        const updated = await cartApi.removeItem(productId);
        setCart(updated);
      } catch (err) {
        console.error("Remove item error:", err);
      }
    });
  };

  const clearCart = async () => {
    startTransition(async () => {
      try {
        const updated = await cartApi.clearCart();
        setCart(updated);
      } catch (err) {
        console.error("Clear cart error:", err);
      }
    });
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        items,
        isLoading,
        totalCount,
        totalPrice,
        totalDiscount,
        finalPrice,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        refreshCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
