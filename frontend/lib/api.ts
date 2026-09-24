import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5079/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// اینترسپتور ارسال درخواست
api.interceptors.request.use(
  (config) => {
    // اولویت ۱: خواندن از localStorage
    let token: string | null | undefined =
      typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    // اولویت ۲: خواندن از کوکی در صورت وجود
    if (!token) {
      token = Cookies.get('agro_token') || Cookies.get('token') || null;
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// اینترسپتور پاسخ (مدیریت ۴۰۱)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        Cookies.remove('agro_token');
        Cookies.remove('agro_role');

        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
