'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '@/lib/api';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  phoneNumber?: string;
  farmOrStoreName?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = Cookies.get('agro_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // خواندن مشخصات کاربر جاری از اندپوینت Me بک‌اند
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch {
        // در صورت بروز خطا یا نامعتبر بودن توکن
        Cookies.remove('agro_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (token: string, userData: User) => {
    // ذخیره توکن با اعتبار ۷ روزه در کوکی برای دسترسی Next.js Middleware
    Cookies.set('agro_token', token, { expires: 7, sameSite: 'lax' });
    setUser(userData);
  };

  const logout = () => {
    Cookies.remove('agro_token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
