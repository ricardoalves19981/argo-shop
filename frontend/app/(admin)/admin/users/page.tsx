"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Search,
  Shield,
  ShieldAlert,
  UserCheck,
  UserX,
  RefreshCw,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Package,
} from "lucide-react";

interface UserItem {
  id: string;
  fullName: string;
  userName?: string;
  email?: string;
  phoneNumber?: string;
  farmOrStoreName?: string;
  city?: string;
  roles: string[];
  isLockedOut: boolean;
  createdAt: string;
  ordersCount: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // دریافت لیست کاربران از بک‌اند
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        pageNumber: page.toString(),
        pageSize: pageSize.toString(),
        ...(search.trim() && { search: search.trim() }),
      });

      const res = await fetch(`http://localhost:5079/api/users?${params}`, {
        method: "GET",
        credentials: "include", // کوکی احراز هویت
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("خطا در برقراری ارتباط با سرور");
      }

      const json = await res.json();
      setUsers(json.data || []);
      setTotalPages(json.totalPages || 1);
      setTotalCount(json.totalCount || 0);
    } catch (err) {
      console.error("خطا در دریافت کاربران:", err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    fetchUsers();
  }, [page]); // با تغییر صفحه، خودکار فراخوانی می‌شود

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  // فعال‌سازی یا مسدود کردن حساب کاربری
  const handleToggleLock = async (userId: string, currentStatus: boolean) => {
    const actionText = currentStatus ? "فعال‌سازی" : "مسدود کردن";
    if (!confirm(`آیا از ${actionText} این کاربر اطمینان دارید؟`)) return;

    setUpdatingId(userId);
    try {
      const res = await fetch(
        `http://localhost:5079/api/users/${userId}/toggle-lock`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      if (res.ok) {
        const result = await res.json();
        // آپدیت سریع در استیت
        setUsers((prev) =>
          prev.map((u) =>
            u.id === userId ? { ...u, isLockedOut: result.isLockedOut } : u,
          ),
        );
      } else {
        alert("عملیات با خطا مواجه شد.");
      }
    } catch (error) {
      console.error(error);
      alert("خطا در شبکه");
    } finally {
      setUpdatingId(null);
    }
  };

  // تغییر نقش کاربر بین Admin و Customer
  const handleChangeRole = async (userId: string, newRole: string) => {
    setUpdatingId(userId);
    try {
      const res = await fetch(
        `http://localhost:5079/api/users/${userId}/role`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        },
      );

      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, roles: [newRole] } : u)),
        );
      } else {
        alert("خطا در تغییر نقش کاربر.");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 text-right font-sans" dir="rtl">
      {/* سربرگ */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">مدیریت کاربران</h1>
          <p className="text-sm text-gray-500 mt-1">
            مجموع کاربران ثبت‌شده:{" "}
            <span className="font-semibold text-emerald-600">{totalCount}</span>{" "}
            نفر
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 rounded-xl transition duration-150 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          به‌روزرسانی
        </button>
      </div>

      {/* فرم جستجو */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="جستجو بر اساس نام، نام خانوادگی، شماره تماس، ایمیل، مزرعه یا فروشگاه..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-11 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
            />
            <Search className="w-5 h-5 absolute right-3.5 top-3 text-gray-400 pointer-events-none" />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition duration-150 shadow-sm"
          >
            جستجو
          </button>
        </form>
      </div>

      {/* جدول داده‌ها */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead className="bg-gray-50/80 text-gray-600 border-b border-gray-100 font-semibold text-xs">
              <tr>
                <th className="py-4 px-5">مشخصات کاربر</th>
                <th className="py-4 px-5">مزرعه / شهر</th>
                <th className="py-4 px-5">اطلاعات تماس</th>
                <th className="py-4 px-5">نقش</th>
                <th className="py-4 px-5">سفارش‌ها</th>
                <th className="py-4 px-5">وضعیت اکانت</th>
                <th className="py-4 px-5 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    در حال دریافت فهرست کاربران...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-400">
                    کاربری با این مشخصات یافت نشد.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isAdmin = user.roles.includes("Admin");
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {/* نام و شناسه کاربر */}
                      <td className="py-4 px-5">
                        <div className="font-semibold text-gray-900">
                          {user.fullName || "بدون نام"}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          عضویت:{" "}
                          {new Date(user.createdAt).toLocaleDateString("fa-IR")}
                        </div>
                      </td>

                      {/* مزرعه یا شهر */}
                      <td className="py-4 px-5">
                        {user.farmOrStoreName ? (
                          <div className="flex items-center gap-1.5 text-xs text-gray-800 font-medium">
                            <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            {user.farmOrStoreName}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                        {user.city && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            {user.city}
                          </div>
                        )}
                      </td>

                      {/* اطلاعات تماس */}
                      <td className="py-4 px-5">
                        {user.phoneNumber && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-700 font-mono">
                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span dir="ltr">{user.phoneNumber}</span>
                          </div>
                        )}
                        {user.email && (
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1 font-mono">
                            <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            {user.email}
                          </div>
                        )}
                      </td>

                      {/* نقش و تغییر نقش */}
                      <td className="py-4 px-5">
                        <select
                          disabled={updatingId === user.id}
                          value={isAdmin ? "Admin" : "Customer"}
                          onChange={(e) =>
                            handleChangeRole(user.id, e.target.value)
                          }
                          className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border focus:outline-none transition ${
                            isAdmin
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          <option value="Customer">مشتری (Customer)</option>
                          <option value="Admin">مدیر (Admin)</option>
                        </select>
                      </td>

                      {/* تعداد سفارش‌ها */}
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                          <Package className="w-3.5 h-3.5 text-gray-400" />
                          {user.ordersCount} سفارش
                        </span>
                      </td>

                      {/* وضعیت حساب */}
                      <td className="py-4 px-5">
                        {user.isLockedOut ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-100">
                            <UserX className="w-3 h-3" />
                            مسدود شده
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <UserCheck className="w-3 h-3" />
                            فعال
                          </span>
                        )}
                      </td>

                      {/* دکمه عملیات مسدود/فعال‌سازی */}
                      <td className="py-4 px-5 text-center">
                        <button
                          disabled={updatingId === user.id}
                          onClick={() =>
                            handleToggleLock(user.id, user.isLockedOut)
                          }
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition duration-150 disabled:opacity-50 ${
                            user.isLockedOut
                              ? "border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                              : "border-rose-300 text-rose-700 bg-rose-50 hover:bg-rose-100"
                          }`}
                        >
                          {user.isLockedOut ? "رفع مسدودی" : "مسدود کردن"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* صفحه‌بندی (Pagination) */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <span className="text-xs text-gray-500">
              نمایش صفحه {page} از {totalPages}
            </span>
            <div className="flex gap-1.5">
              <button
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => p - 1)}
                className="px-3.5 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition"
              >
                قبلی
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    (p >= page - 1 && p <= page + 1),
                )
                .map((p, index, array) => {
                  const showEllipsis = index > 0 && p - array[index - 1] > 1;
                  return (
                    <div key={p} className="flex items-center gap-1.5">
                      {showEllipsis && (
                        <span className="text-gray-400 text-xs px-1">...</span>
                      )}
                      <button
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-lg transition ${
                          page === p
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    </div>
                  );
                })}
              <button
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
                className="px-3.5 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-40 transition"
              >
                بعدی
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
