"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminShell({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: "داشبورد", href: "/admin", icon: "📊" },
    { name: "کاربران", href: "/admin/users", icon: "👥" },
    { name: "پیام‌ها", href: "/admin/messages", icon: "📬" },
    { name: "پروژه‌ها", href: "/admin/portfolio", icon: "📁" },
    { name: "سوالات متداول", href: "/admin/questions", icon: "❓" },
    { name: "آمار و گزارشات", href: "/admin/analytics", icon: "📈" },
    { name: "تنظیمات", href: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div
      className="min-h-screen bg-gray-50/70 text-gray-900 flex flex-col md:flex-row"
      dir="rtl"
    >
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        {/* کدی که باید جایگزین بخش فعلی لوگو/برند در سایدبار شود */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80 hover:bg-slate-800/40 transition-colors group"
          title="مشاهده صفحه اصلی سایت در تب جدید"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            W
          </div>
          <div>
            <h2 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
              وب‌رایان
              <svg
                className="w-3.5 h-3.5 opacity-70"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </h2>
            <p className="text-xs text-slate-400">مشاهده سایت اصلی ↗</p>
          </div>
        </a>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                    : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer / Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20">
          <button
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition"
          >
            <span>🚪</span>
            <span>خروج از سیستم</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200/80 px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
            >
              ☰
            </button>
            <h1 className="text-base font-bold text-gray-800">
              {navigation.find((n) => n.href === pathname)?.name ||
                "پنل مدیریت"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-gray-900">
                {user?.name || "مدیر سیستم"}
              </div>
              <div className="text-[11px] text-gray-500">
                {user?.email || "admin@webrayan.ir"}
              </div>
            </div>
            <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm border border-blue-200">
              {(user?.name || "A").charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
