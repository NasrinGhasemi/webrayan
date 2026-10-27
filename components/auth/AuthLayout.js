export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-50 font-vazir">
      {/* پنل برندینگ */}
      <aside className="relative hidden lg:flex overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-cyan-300/20 blur-3xl" />
        <div className="relative m-auto max-w-md space-y-6 px-10 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur ring-1 ring-white/25">
            <span className="text-2xl font-extrabold">WR</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">WebRayan</h1>
          <p className="text-sm leading-7 text-blue-50/90">
            ورود امن و سریع به پنل مدیریت وب‌رایان؛ مدیریت پیام‌ها، سوالات، نمونه‌کارها و تنظیمات سایت در یک جا.
          </p>
          <ul className="space-y-2 text-xs text-blue-50/80">
            <li>• احراز هویت امن با محدودیت تلاش ناموفق</li>
            <li>• دسترسی محدود به کاربران مجاز</li>
          </ul>
        </div>
      </aside>

      {/* فرم */}
      <main className="flex items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          {/* لوگوی موبایل */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg">
              <span className="font-extrabold">WR</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800">WebRayan</h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
            {children}
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} WebRayan. تمامی حقوق محفوظ است.
          </p>
        </div>
      </main>
    </div>
  );
}
