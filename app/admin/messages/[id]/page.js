"use client";

import React, { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Toast from "@/components/ui/Toast";

export default function AdminMessageDetailPage({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const messageId = unwrappedParams.id;

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");
  const [sendEmailFlag, setSendEmailFlag] = useState(true);
  const [submittingReply, setSubmittingReply] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const showToast = useCallback((t) => setToast(t), []);
  const closeToast = useCallback(() => setToast(null), []);

  // دریافت توکن CSRF از اندپوینت استاندارد پروژه
  const fetchCsrfToken = useCallback(async () => {
    try {
      const res = await fetch("/api/csrf-token", {
        cache: "no-store",
        credentials: "include",
      });
      const data = await res.json();
      const token = data?.csrfToken || data?.token || "";
      setCsrfToken(token);
      return token;
    } catch {
      setCsrfToken("");
      return "";
    }
  }, []);

  // دریافت جزئیات پیام
  const fetchMessage = useCallback(async () => {
    if (!messageId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/messages/${messageId}`, {
        cache: "no-store",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در دریافت جزئیات پیام");

      const msgObj = data.data || data.message || data;
      setMessage(msgObj);

      // علامت‌گذاری خودکار به‌عنوان خوانده‌شده
      if (msgObj && !msgObj.isRead) {
        try {
          const cr = await fetch("/api/csrf-token", {
            cache: "no-store",
            credentials: "include",
          });
          const cd = await cr.json();
          const pr = await fetch(`/api/admin/messages/${messageId}`, {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "x-csrf-token": cd.csrfToken || "",
            },
            body: JSON.stringify({ isRead: true }),
          });
          if (pr.ok) setMessage({ ...msgObj, isRead: true });
        } catch (e) {
          console.error("mark read failed", e);
        }
      }

      // اگر از قبل پاسخی ثبت شده باشد در تکست‌اریا قرار بگیرد
      if (msgObj?.replyText) {
        setReplyText((prev) => prev || msgObj.replyText);
      }
    } catch (err) {
      showToast({
        message: err.message || "دریافت اطلاعات پیام ناموفق بود",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  }, [messageId, showToast]);

  useEffect(() => {
    fetchCsrfToken();
    fetchMessage();
  }, [fetchCsrfToken, fetchMessage]);

  // ارسال پاسخ به پیام (اصلاح شده به اندپوینت ادمین)
  const handleSendReply = async (e) => {
    e.preventDefault();
    const text = replyText.trim();
    if (!text) {
      showToast({ message: "لطفاً متن پاسخ را وارد کنید.", type: "warning" });
      return;
    }

    setSubmittingReply(true);
    try {
      let token = csrfToken;
      if (!token) {
        token = await fetchCsrfToken();
      }

      const res = await fetch(`/api/admin/messages/${messageId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "x-csrf-token": token }),
        },
        body: JSON.stringify({ text, sendEmail: sendEmailFlag }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "ثبت پاسخ با خطا مواجه شد.");

      showToast({ message: "پاسخ با موفقیت ثبت شد.", type: "success" });
      await fetchMessage();
      router.refresh();
    } catch (err) {
      showToast({ message: err.message || "خطا در ارسال پاسخ", type: "error" });
    } finally {
      setSubmittingReply(false);
    }
  };

  // حذف پیام
  const handleDelete = async () => {
    setDeleting(true);
    try {
      let token = csrfToken;
      if (!token) {
        token = await fetchCsrfToken();
      }

      const res = await fetch(`/api/admin/messages/${messageId}`, {
        method: "DELETE",
        headers: {
          ...(token && { "x-csrf-token": token }),
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "حذف پیام با خطا مواجه شد.");

      showToast({ message: "پیام با موفقیت حذف شد.", type: "success" });
      router.push("/admin/messages");
      router.refresh();
    } catch (err) {
      showToast({ message: err.message || "خطا در حذف پیام", type: "error" });
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const safeText = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (typeof val === "object")
      return val.text || val.body || JSON.stringify(val);
    return String(val);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        در حال بارگذاری اطلاعات پیام…
      </div>
    );
  }

  if (!message) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-red-500">پیام مورد نظر یافت نشد.</p>
        <Link href="/admin/messages" className="text-blue-600 underline">
          بازگشت به لیست پیام‌ها
        </Link>
      </div>
    );
  }

  const isReplied = !!message.isReplied || message.status === "replied";
  const isRead = !!message.isRead || isReplied;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
      {/* هدر صفحه */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            جزئیات پیام و پاسخ‌دهی
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            شناسه پیام: {message.id || message._id}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/messages"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
          >
            بازگشت به لیست
          </Link>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
          >
            حذف پیام
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* اطلاعات اصلی پیام (2 ستون) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                {safeText(message.subject) || "بدون موضوع"}
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  isReplied
                    ? "bg-green-100 text-green-800"
                    : isRead
                      ? "bg-blue-100 text-blue-800"
                      : "bg-orange-100 text-orange-800"
                }`}
              >
                {isReplied
                  ? "پاسخ داده شده"
                  : isRead
                    ? "خوانده شده"
                    : "بررسی نشده / در انتظار"}
              </span>
            </div>

            <div className="text-xs text-gray-400">
              تاریخ ثبت:{" "}
              {message.createdAt
                ? new Date(message.createdAt).toLocaleString("fa-IR")
                : "-"}
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap leading-relaxed">
              {safeText(message.message) || "متنی ثبت نشده است."}
            </div>
          </div>

          {/* فرم ارسال پاسخ جدید */}
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">
              ارسال پاسخ جدید
            </h2>
            <form onSubmit={handleSendReply} className="space-y-4">
              <textarea
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                rows={5}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="متن پاسخ خود را اینجا بنویسید..."
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendEmailFlag}
                    onChange={(e) => setSendEmailFlag(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  ارسال پاسخ به ایمیل کاربر
                </label>
                <button
                  type="submit"
                  disabled={submittingReply}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm transition-colors"
                >
                  {submittingReply ? "در حال ارسال..." : "ارسال پاسخ"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* اطلاعات فرستنده (1 ستون) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">
              اطلاعات فرستنده
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500 block">نام و نام خانوادگی:</span>
                <span className="font-medium text-gray-800">
                  {message.name || "ناشناس"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 block">ایمیل:</span>
                <span className="font-medium text-gray-800 dir-ltr inline-block">
                  {message.email || "-"}
                </span>
              </div>
              {message.phone && (
                <div>
                  <span className="text-gray-500 block">شماره تماس:</span>
                  <span className="font-medium text-gray-800 dir-ltr inline-block">
                    {message.phone}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* مدال تایید حذف */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-gray-900">تایید حذف پیام</h3>
            <p className="text-sm text-gray-600">
              آیا از حذف این پیام اطمینان دارید؟ این عملیات غیرقابل بازگشت است.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleting}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
              >
                {deleting ? "در حال حذف..." : "بله، حذف شود"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
