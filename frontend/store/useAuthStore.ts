import { create } from 'zustand';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,

  login: (token: string, user: User) => {
    // ۱. ذخیره در کوکی با تاریخ انقضای ۷ روزه برای استفاده در Middleware
    Cookies.set('agro_token', token, { expires: 7 });
    Cookies.set('agro_role', user.role, { expires: 7 });

    set({
      token,
      user,
      isAuthenticated: true,
      isAdmin: user.role === 'Admin',
    });
  },

  logout: () => {
    // پاک کردن کوکی‌ها
    Cookies.remove('agro_token');
    Cookies.remove('agro_role');

    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isAdmin: false,
    });
  },
}));
