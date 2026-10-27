'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: '',
    siteDescription: '',
    email: '',
    phone: '',
    address: '',
    socialLinks: {
      telegram: '',
      instagram: '',
      linkedin: '',
      github: '',
    },
  });

  const [csrfToken, setCsrfToken] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // واکشی توکن CSRF و تنظیمات اولیه از سرور
  useEffect(() => {
    // دریافت توکن CSRF
    fetch('/api/csrf-token')
      .then(res => res.json())
      .then(data => {
        if (data.csrfToken) setCsrfToken(data.csrfToken);
      })
      .catch(err => console.error('Error fetching CSRF token:', err));

    // واکشی تنظیمات سامانه
    fetch('/api/admin/settings')
      .then(async res => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'خطا در بارگذاری اطلاعات');
        if (json.success && json.data) {
          setSettings(json.data);
        }
      })
      .catch(err => {
        console.error(err);
        showToast('خطا در بارگذاری اطلاعات از سرور.', 'error');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify(settings),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'خطا در ذخیره تنظیمات');
      }

      showToast('تنظیمات با موفقیت ذخیره شد.', 'success');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'خطا در ذخیره تنظیمات.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500 text-sm animate-pulse">در حال بارگذاری تنظیمات...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-white shadow-lg transition-all ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">تنظیمات عمومی سامانه</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* اطلاعات عمومی */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span>🌐</span> اطلاعات عمومی وب‌سایت
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">نام سایت / برند</label>
              <input
                type="text"
                value={settings.siteName || ''}
                onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="مثال: وب‌رایان"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">توضیحات کوتاه (Meta Description)</label>
              <textarea
                rows={3}
                value={settings.siteDescription || ''}
                onChange={e => setSettings({ ...settings, siteDescription: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="توضیحی درباره فعالیت وب‌رایان..."
              />
            </div>
          </div>
        </div>

        {/* راه‌های ارتباطی */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span>✉️</span> راه‌های ارتباطی
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل پشتیبانی</label>
              <input
                type="email"
                value={settings.email || ''}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-left"
                dir="ltr"
                placeholder="info@webrayan.ir"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">شماره تماس</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={e => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-left"
                dir="ltr"
                placeholder="021-12345678"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">آدرس دفتر / شرکت</label>
              <textarea
                rows={2}
                value={settings.address || ''}
                onChange={e => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="تهران، خیابان..."
              />
            </div>
          </div>
        </div>

        {/* شبکه‌های اجتماعی */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <span>🔗</span> شبکه‌های اجتماعی
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="ltr">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">تلگرام</label>
              <input
                type="text"
                value={settings.socialLinks?.telegram || ''}
                onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, telegram: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="https://t.me/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">اینستاگرام</label>
              <input
                type="text"
                value={settings.socialLinks?.instagram || ''}
                onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, instagram: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="https://instagram.com/username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">گیت‌هاب</label>
              <input
                type="text"
                value={settings.socialLinks?.github || ''}
                onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, github: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="https://github.com/username"
              />
            </div>
            <div>
              <label className="block thex-sm font-medium text-gray-700 mb-1 text-right">لینکدین</label>
              <input
                type="text"
                value={settings.socialLinks?.linkedin || ''}
                onChange={e => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, linkedin: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>
        </div>

        {/* دکمه ذخیره */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? 'در حال ذخیره...' : '✓ ذخیره تغییرات'}
          </button>
        </div>
      </form>
    </div>
  );
}
