// src/context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import api from "@/lib/api";

export interface User {
  id: string;
  userName?: string;
  fullName?: string;
  email?: string;
  role?: string;
  roles?: string[];
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  // پشتیبانی از هر دو حالت: login(user) یا login(token, user)
  login: (userDataOrToken: any, maybeUser?: any) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  setUser: () => {},
  login: () => {},
  logout: async () => {},
  checkAuth: async () => {},
});

// تابع کمکی برای نرمال‌سازی نقش کاربر
const normalizeUser = (userData: any): User | null => {
  if (!userData) return null;

  let role = userData.role;
  if (!role && Array.isArray(userData.roles) && userData.roles.length > 0) {
    role = userData.roles[0];
  }

  const isAdmin =
    role?.toLowerCase() === "admin" ||
    (Array.isArray(userData.roles) &&
      userData.roles.some((r: string) => r.toLowerCase() === "admin"));

  return {
    ...userData,
    role: role || "Customer",
    isAdmin: Boolean(isAdmin),
  };
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      // مرورگر به لطف api (withCredentials: true)، کوکی agro_token را خودکار می‌فرستد
      const res = await api.get("/auth/me");
      if (res.data) {
        setUser(normalizeUser(res.data));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userDataOrToken: any, maybeUser?: any) => {
    // اگر صفحه لاگین دو ورودی فرستاده بود: login(token, user)
    // یا اگر یک ورودی فرستاده بود: login(user)
    const targetUser = maybeUser ? maybeUser : userDataOrToken;
    const normalized = normalizeUser(targetUser);
    setUser(normalized);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("خطا در لاگ‌اوت سمت سرور:", err);
    } finally {
      setUser(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
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
