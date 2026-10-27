"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ChartBarIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  EnvelopeIcon,
  ComputerDesktopIcon,
  ArrowPathIcon,
  FunnelIcon,
  CalendarDaysIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState(null);
  const [authLogs, setAuthLogs] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logPage, setLogPage] = useState(1);
  const [logTypeFilter, setLogTypeFilter] = useState("");
  const [logPagination, setLogPagination] = useState({});
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(() => {
    fetch("/api/csrf-token")
      .then((r) => r.json())
      .then((d) => setCsrfToken(d.csrfToken || d.secret || ""))
      .catch(() => {});
  }, []);

  const LOG_TYPE_LABELS = {
    LOGIN: "ورود موفق",
    FAILED_LOGIN: "ورود ناموفق",
    LOGOUT: "خروج",
  };

  const [pendingDelete, setPendingDelete] = useState(null); // { log } | { all: true }

  const requestDelete = (log) => {
    setPendingDelete(log ? { log } : { all: true });
  };

  const performDelete = async () => {
    const target = pendingDelete;
    setPendingDelete(null);
    if (!target) return;
    const log = target.log;
    try {
      const url = log ? `/api/admin/auth-logs?id=${log.id}` : "/api/admin/auth-logs?all=true";
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "x-csrf-token": csrfToken },
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "حذف انجام نشد");
      showToast(
        log ? "لاگ انتخاب‌شده با موفقیت حذف شد" : `${data.deleted ?? 0} لاگ امنیتی حذف شد`,
        "success"
      );
      fetchAnalyticsData();
    } catch (err) {
      showToast(err.message || "حذف انجام نشد", "error");
    }
  };
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  }, []);

  const fetchAnalyticsData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      // 1. Fetch Stats
      const statsRes = await fetch(`/api/admin/stats?t=${Date.now()}`, { cache: "no-store" });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats || statsData);
      }

      // 2. Fetch Auth Logs
      const logsUrl = `/api/admin/auth-logs?page=${logPage}&limit=10${logTypeFilter ? `&type=${logTypeFilter}` : ""}&t=${Date.now()}`;
      const logsRes = await fetch(logsUrl, { cache: "no-store" });
      const logsData = await logsRes.json();
      if (logsData.success) {
        setAuthLogs(logsData.data || logsData.logs || []);
        setLogPagination(logsData.pagination || {});
      }

      // 3. Fetch Active Sessions
      const sessRes = await fetch(`/api/admin/sessions?limit=10&t=${Date.now()}`, { cache: "no-store" });
      const sessData = await sessRes.json();
      if (sessData.success) {
        setSessions(sessData.data || sessData.sessions || []);
      }

      if (isRefresh) showToast("اطلاعات گزارشات به‌روزرسانی شد", "success");
    } catch (error) {
      console.error("Analytics fetch error:", error);
      showToast("خطا در دریافت اطلاعات آماری از سرور", "error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [logPage, logTypeFilter, showToast]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  if (loading && !stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-vazir">در حال بارگذاری آمار و گزارشات سامانه...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto animate-fadeIn font-vazir" dir="rtl">
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" dir="rtl">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="text-base font-bold text-gray-800">
              {pendingDelete.all ? "حذف همه لاگ‌های امنیتی" : "حذف لاگ امنیتی"}
            </h3>
            <p className="text-sm text-gray-600 leading-7">
              {pendingDelete.all
                ? `همه ${logPagination.total ?? authLogs.length} لاگ امنیتی حذف شوند؟ این کار برگشت‌پذیر نیست.`
                : `لاگ «${LOG_TYPE_LABELS[pendingDelete.log.type] || pendingDelete.log.type}» مربوط به ${
                    pendingDelete.log.timestamp
                      ? new Date(pendingDelete.log.timestamp).toLocaleString("fa-IR")
                      : "زمان نامشخص"
                  } (IP: ${pendingDelete.log.ip || "نامشخص"}) حذف شود؟`}
            </p>
            <div className="flex justify-start gap-2 pt-2">
              <button
                type="button"
                onClick={performDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-sm hover:bg-rose-700"
              >
                بله، حذف کن
              </button>
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm hover:bg-gray-50"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <ChartBarIcon className="w-8 h-8 text-blue-600 p-1.5 bg-blue-50 rounded-xl" />
            <span>آمار و گزارشات پیشرفته سامانه</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            تحلیل وضعیت کاربران، پیام‌ها، رویدادهای امنیتی و نشست‌های فعال
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => fetchAnalyticsData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
          >
            <ArrowPathIcon className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
            <span>{refreshing ? "در حال به‌روزرسانی..." : "بروزرسانی داده‌ها"}</span>
          </Button>
          <Link
            href="/admin"
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all"
          >
            داشبورد
          </Link>
        </div>
      </div>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <UserGroupIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">کل کاربران سامانه</p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">
              {stats?.totalUsers ?? stats?.usersCount ?? 0}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <EnvelopeIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">کل پیام‌های دریافتی</p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">
              {stats?.totalMessages ?? stats?.messagesCount ?? 0}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <ExclamationCircleIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">پیام‌های خوانده‌نشده</p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">
              {stats?.unreadMessages ?? 0}
            </h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheckIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">ورود ناموفق (۲۴ ساعت اخیر)</p>
            <h3 className="text-xl font-bold text-gray-800 mt-1">
              {stats?.failedLogins24h ?? 0}
            </h3>
          </div>
        </div>
      </div>

      {/* Security Auth Logs Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
              <span>لاگ‌های امنیتی و رویدادهای احراز هویت</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              تاریخچه ورود، خروج و تلاش‌های امنیتی کاربران به سامانه
            </p>
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-4 h-4 text-gray-400" />
            <select
              value={logTypeFilter}
              onChange={(e) => {
                setLogTypeFilter(e.target.value);
                setLogPage(1);
              }}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-right"
            >
              <option value="">همه رویدادها</option>
              <option value="LOGIN">ورود موفق</option>
              <option value="LOGOUT">خروج</option>
              <option value="FAILED_LOGIN">خطای ورود</option>
            </select>
            <button
              type="button"
              onClick={() => requestDelete(null)}
              disabled={authLogs.length === 0}
              className="text-xs px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-40"
            >
              حذف همه
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">نوع رویداد</th>
                <th className="py-3 px-4">شناسه کاربر</th>
                <th className="py-3 px-4">آدرس IP</th>
                <th className="py-3 px-4">مرورگر / کلاینت</th>
                <th className="py-3 px-4">زمان ثبت</th>
                <th className="py-3 px-4">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {authLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-400 text-sm">
                    هیچ لاگ امنیتی ثبت نشده است.
                  </td>
                </tr>
              ) : (
                authLogs.map((log) => (
                  <tr key={log._id || log.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        log.type === "LOGIN" ? "bg-emerald-50 text-emerald-700" :
                        log.type === "FAILED_LOGIN" ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700"
                      }`}>
                        {log.type === "LOGIN" ? "ورود موفق" : log.type === "FAILED_LOGIN" ? "ورود ناموفق" : log.type === "LOGOUT" ? "خروج" : log.type}
                      </span>
                      {log.reason && (
                        <span className="block text-[10px] text-gray-400 mt-1 font-mono dir-ltr text-right">{log.reason}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs dir-ltr text-right">
                      {log.userId || "ناشناس"}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs dir-ltr text-right">
                      {log.ip || "نامشخص"}
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs truncate max-w-xs">
                      {log.userAgent || "نامشخص"}
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString("fa-IR") : "نامشخص"}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => requestDelete(log)}
                        className="text-xs text-rose-600 hover:underline"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {logPagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-600">
            <span>صفحه {logPagination.page} از {logPagination.totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setLogPage((p) => Math.max(p - 1, 1))}
                disabled={!logPagination.hasPrevPage}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-lg transition-all"
              >
                قبلی
              </button>
              <button
                onClick={() => setLogPage((p) => p + 1)}
                disabled={!logPagination.hasNextPage}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-lg transition-all"
              >
                بعدی
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Active Sessions Section */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-6 space-y-4">
        <div className="border-b border-gray-100 pb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <ComputerDesktopIcon className="w-5 h-5 text-blue-600" />
            <span>نشست‌های فعال سامانه</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            لیست کاربران و نشست‌های در حال استفاده در سیستم
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4">ادمین</th>
                <th className="py-3 px-4">آخرین ورود</th>
                <th className="py-3 px-4">انقضای نشست</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sessions.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-8 text-gray-400 text-sm">
                    هیچ نشست فعالی یافت نشد.
                  </td>
                </tr>
              ) : (
                sessions.map((sess) => (
                  <tr key={sess._id || sess.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-4 text-gray-700 text-xs dir-ltr text-right font-mono">
                      {sess.name || sess.email || sess.id}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-xs">
                      {sess.lastLogin ? new Date(sess.lastLogin).toLocaleString("fa-IR") : "نامشخص"}
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-xs">
                      {sess.expires ? new Date(sess.expires).toLocaleString("fa-IR") : "نامشخص"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
