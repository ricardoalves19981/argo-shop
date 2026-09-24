// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export interface User {
  id: string;
  userName?: string;
  fullName?: string;
  email?: string;
  role?: string;
  roles?: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (token: string, user: User) => void; // 👈 اضافه شد
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  setUser: () => {},
  login: () => {}, // 👈 مقدار پیش‌فرض
  logout: async () => {},
  checkAuth: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // بررسی وضعیت لاگین هنگام لود اولیه صفحه
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {}
      }

      const res = await fetch("http://localhost:5079/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("خطا در بررسی نشست کاربر:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // متد لاگین جهت ثبت توکن، کوکی‌ها و استیت
  const login = (token: string, userData: User) => {
    setUser(userData);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));

    // ست کردن کوکی‌ها برای استفاده میدل‌ور و درخواست‌های SSR
    Cookies.set("agro_token", token, { path: "/", expires: 7 });
    if (userData.role) {
      Cookies.set("agro_role", userData.role, { path: "/", expires: 7 });
    }
  };

  // src/context/AuthContext.tsx

  // src/context/AuthContext.tsx

  const logout = async () => {
    try {
      // ۱. اطلاع به سرور
      await fetch("http://localhost:5079/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("خطا در لاگ‌اوت سمت سرور:", err);
    } finally {
      // ۲. صفر کردن استیت ری‌اکت
      setUser(null);

      // ۳. پاک کردن LocalStorage
      localStorage.clear();

      // ۴. تابع کمکی برای پاک کردن یک کوکی در تمام دامنه‌ها و مسیرها
      const expireCookie = (name: string) => {
        // حذف استاندارد با js-cookie
        Cookies.remove(name, { path: "/" });
        Cookies.remove(name);

        // حذف مستقیم با document.cookie برای انواع مسیرها و دامنه‌ها
        document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0;`;
        document.cookie = `${name}=; Path=/; Domain=${window.location.hostname}; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0;`;
        document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=0;`;
      };

      // اعمال حذف برای تمامی کوکی‌های پروژه
      ["agro_token", "agro_role", "token", "user"].forEach(expireCookie);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, setUser, login, logout, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
