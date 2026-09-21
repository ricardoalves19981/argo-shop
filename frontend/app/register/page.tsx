'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phoneNumber: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // فرض بر این است که API شما روی پورت ۵۰۰۰ یا مشابه اجرا می‌شود
      await axios.post('http://localhost:5079/api/auth/register', formData);
      router.push('/login'); // هدایت به لاگین پس از ثبت‌نام موفق
    } catch (err: any) {
      setError(err.response?.data?.message || 'خطایی در ثبت‌نام رخ داد');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center">ثبت‌نام در آگروشاپ</h1>
      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" placeholder="نام و نام خانوادگی" required
          className="w-full p-3 border rounded-lg"
          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
        />
        <input 
          type="email" placeholder="ایمیل" required
          className="w-full p-3 border rounded-lg"
          onChange={(e) => setFormData({...formData, email: e.target.value})}
        />
        <input 
          type="password" placeholder="رمز عبور" required
          className="w-full p-3 border rounded-lg"
          onChange={(e) => setFormData({...formData, password: e.target.value})}
        />
        <input 
          type="text" placeholder="شماره موبایل" required
          className="w-full p-3 border rounded-lg"
          onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
        />
        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">
          ثبت‌نام
        </button>
      </form>
    </div>
  );
}
