"use client";

import { useEffect, useState } from "react";
import { Building2, User, Phone, MapPin, Save, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    farmOrStoreName: "",
    city: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("http://localhost:5079/api/profile/overview", {
          credentials: "include",
        });
        if (res.ok) {
          const json = await res.json();
          setFormData({
            fullName: json.fullName || "",
            phoneNumber: json.phoneNumber || "",
            farmOrStoreName: json.farmOrStoreName || "",
            city: json.city || "",
            address: json.address || "",
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);

    try {
      const res = await fetch("http://localhost:5079/api/profile/overview", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMsg({ type: "success", text: "اطلاعات با موفقیت ذخیره شد." });
      } else {
        setMsg({ type: "error", text: "خطا در ذخیره‌سازی اطلاعات." });
      }
    } catch {
      setMsg({ type: "error", text: "خطای ارتباط با سرور." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center bg-white rounded-2xl border border-gray-100 shadow-sm">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          مشخصات حساب و آدرس مزرعه
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          این اطلاعات برای فاکتور و ارسال نهاده‌ها و باربری استفاده می‌شود.
        </p>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-medium ${
            msg.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-rose-50 text-rose-700 border border-rose-200"
          }`}
        >
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              نام و نام خانوادگی
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              شماره تماس
            </label>
            <div className="relative">
              <input
                type="text"
                dir="ltr"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
              />
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              نام مزرعه، گلخانه یا فروشگاه
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="مثلاً مزرعه باران یا داروخانه گیاه‌پزشکی"
                value={formData.farmOrStoreName}
                onChange={(e) =>
                  setFormData({ ...formData, farmOrStoreName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              شهر / منطقه
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="مثلاً شیراز، مرودشت"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            آدرس دقیق تحویل سفارش
          </label>
          <textarea
            rows={3}
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            placeholder="نشانی پستی، کیلومتر جاده، پلاک یا مشخصات جهت تحویل بار..."
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl shadow-sm transition disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            ذخیره تغییرات
          </button>
        </div>
      </form>
    </div>
  );
}
