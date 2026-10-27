"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  HiUsers,
  HiMail,
  HiBriefcase,
  HiCog,
  HiArrowRight,
  HiShieldCheck,
  HiInbox,
  HiQuestionMarkCircle
} from "react-icons/hi";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    usersCount: 0,
    messagesCount: 0,
    unreadMessages: 0,
    portfolioCount: 0,
    questionsCount: 0,
    unreadQuestions: 0,
    answeredQuestions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setStats(data.stats);
        } else if (data.usersCount !== undefined) {
          setStats(data);
        }
      })
      .catch(err => console.error('Error fetching stats:', err))
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      title: "کل کاربران ثبت‌نامی",
      value: stats.usersCount || 0,
      description: "کاربران فعال در سامانه",
      link: "/admin/users",
      bg: "bg-blue-50 text-blue-600 border-blue-100",
      icon: <HiUsers className="w-6 h-6" />,
    },
    {
      title: "صندوق پیام‌ها",
      value: stats.messagesCount || 0,
      description: `${stats.unreadMessages || 0} خوانده نشده · ${stats.repliedMessages || 0} پاسخ داده شده · ${stats.unrepliedMessages || 0} بدون پاسخ`,
      link: "/admin/messages",
      bg: "bg-emerald-50 text-emerald-600 border-emerald-100",
      icon: <HiMail className="w-6 h-6" />,
    },
    {
      title: "پروژه‌های نمونه‌کار",
      value: stats.portfolioCount || 0,
      description: `${stats.publishedPortfolio || 0} پروژه منتشرشده`,
      link: "/admin/portfolio",
      bg: "bg-purple-50 text-purple-600 border-purple-100",
      icon: <HiBriefcase className="w-6 h-6" />,
    },
    {
      title: "سوالات متداول کاربران",
      value: stats.questionsCount || 0,
      description: `${stats.unreadQuestions || 0} خوانده نشده · ${stats.answeredQuestions || 0} پاسخ داده شده · ${Math.max((stats.questionsCount || 0) - (stats.answeredQuestions || 0), 0)} بدون پاسخ`,
      link: "/admin/questions",
      bg: "bg-amber-50 text-amber-600 border-amber-100",
      icon: <HiQuestionMarkCircle className="w-6 h-6" />,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-gray-500 font-medium">در حال بارگذاری آمار پنل مدیریت...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-blue-100 border border-white/20">
              <HiShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>سامانه عملیاتی و امن وب‌رایان</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">سلام، ادمین عزیز! 👋</h1>
            <p className="text-blue-100 text-sm max-w-xl leading-relaxed">
              به پنل مدیریت وب‌رایان خوش آمدید. از اینجا می‌توانید کاربران، پیام‌های دریافتی، نمونه‌کارها و تنظیمات سایت را کنترل کنید.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/messages"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-blue-700 font-semibold text-sm shadow-md hover:bg-blue-50 transition-all"
            >
              <HiInbox className="w-5 h-5" />
              <span>صندوق پیام‌ها ({stats.unreadMessages || 0})</span>
            </Link>
          </div>
        </div>
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">آمار کلی سیستم</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {statCards.map((card, idx) => (
            <Link
              key={idx}
              href={card.link}
              className="group block bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-600 group-hover:text-blue-600 transition-colors">
                  {card.title}
                </span>
                <div className={`p-3 rounded-xl ${card.bg} transition-transform group-hover:scale-110`}>
                  {card.icon}
                </div>
              </div>
              <div className="text-3xl font-extrabold text-gray-900 mb-1">
                {card.value}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                {card.description}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Access Shortcuts */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">دسترسی سریع</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/users"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                <HiUsers className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-gray-800">مدیریت کاربران</span>
            </div>
            <HiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:-translate-x-1 transition-all" />
          </Link>

          <Link
            href="/admin/messages"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                <HiMail className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-gray-800">صندوق پیام‌ها</span>
            </div>
            <HiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 group-hover:-translate-x-1 transition-all" />
          </Link>

          <Link
            href="/admin/portfolio"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-purple-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600">
                <HiBriefcase className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-gray-800">نمونه‌کارها</span>
            </div>
            <HiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-purple-600 group-hover:-translate-x-1 transition-all" />
          </Link>

          <Link
            href="/admin/settings"
            className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-orange-200 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-orange-50 text-orange-600">
                <HiCog className="w-5 h-5" />
              </div>
              <span className="text-sm font-semibold text-gray-800">تنظیمات سیستم</span>
            </div>
            <HiArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-600 group-hover:-translate-x-1 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}
