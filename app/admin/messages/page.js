"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Toast from "@/components/ui/Toast";

export default function AdminMessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [appliedSearch, setAppliedSearch] = useState("");
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 1 });
  const [counts, setCounts] = useState({ all: 0, unread: 0, read: 0, replied: 0, unreplied: 0 });
  const [toast, setToast] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);


  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setAppliedSearch(searchTerm.trim());
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        pageSize: String(pageSize),
        status: statusFilter,
        search: appliedSearch,
      });
      const res = await fetch(`/api/admin/messages?${params.toString()}`, {
        cache: "no-store",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "خطا در دریافت لیست پیام‌ها");

      const list = Array.isArray(data)
        ? data
        : data.data || data.messages || [];
      setMessages(Array.isArray(list) ? list : []);
      if (data.pagination) {
        setPagination(data.pagination);
        if (data.pagination.page !== currentPage) setCurrentPage(data.pagination.page);
      }
      if (data.counts) setCounts(data.counts);
    } catch (err) {
      showToast(err.message, "error");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [showToast, currentPage, pageSize, statusFilter, appliedSearch]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const getCsrfToken = async () => {
    try {
      const res = await fetch("/api/csrf-token", {
        cache: "no-store",
        credentials: "include",
      });
      const data = await res.json();
      return (
        data.csrfToken ||
        data.token ||
        data.secretKey ||
        data?.data?.csrfToken ||
        ""
      );
    } catch {
      return "";
    }
  };

  const handleToggleRead = async (id, currentStatus) => {
    try {
      const token = await getCsrfToken();
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "x-csrf-token": token }),
        },
        body: JSON.stringify({ isRead: !currentStatus }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "خطا در به‌روزرسانی وضعیت پیام");

      showToast("وضعیت پیام با موفقیت به‌روز شد.", "success");
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id ? { ...msg, isRead: !currentStatus } : msg,
        ),
      );
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const confirmDelete = (msg) => {
    setMessageToDelete(msg);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!messageToDelete) return;
    setDeleting(true);
    try {
      const token = await getCsrfToken();
      const res = await fetch(`/api/admin/messages/${messageToDelete.id}`, {
        method: "DELETE",
        headers: {
          ...(token && { "x-csrf-token": token }),
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "خطا در حذف پیام");

      showToast("پیام با موفقیت حذف شد.", "success");
      setDeleteModalOpen(false);
      await fetchMessages();
      setMessageToDelete(null);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const isRepliedMsg = (m) =>
    !!m.isReplied || m.status === "replied" || (Array.isArray(m.replies) && m.replies.length > 0);
  const safeMessages = Array.isArray(messages) ? messages : [];
  const paginatedMessages = safeMessages;
  const totalPages = pagination.totalPages || 1;

  const pageNumbers = (() => {
    const pages = [];
    const add = (n) => pages.push(n);
    const cur = currentPage;
    const last = totalPages;
    if (last <= 7) {
      for (let i = 1; i <= last; i++) add(i);
    } else {
      add(1);
      if (cur > 4) add("…");
      for (let i = Math.max(2, cur - 1); i <= Math.min(last - 1, cur + 1); i++) add(i);
      if (cur < last - 3) add("…");
      add(last);
    }
    return pages;
  })();

  return (
    <div className="p-6 max-w-7xl mx-auto font-vazir text-right" dir="rtl">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            مدیریت پیام‌ها و ارتباطات
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            بررسی، پاسخ‌دهی و مدیریت پیام‌های دریافتی کاربران
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          {[
            { key: "all", label: "همه", count: counts.all },
            { key: "unread", label: "خوانده نشده", count: counts.unread },
            { key: "read", label: "خوانده شده", count: counts.read },
            { key: "replied", label: "پاسخ داده شده", count: counts.replied },
            { key: "unreplied", label: "پاسخ داده نشده", count: counts.unreplied },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setStatusFilter(tab.key);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab.key
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="w-full md:w-80">
          <input
            type="text"
            placeholder="جستجو بر اساس نام، ایمیل، موضوع..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            در حال بارگذاری پیام‌ها...
          </div>
        ) : paginatedMessages.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            هیچ پیامی یافت نشد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold border-b border-gray-100">
                  <th className="py-3 px-4">فرستنده</th>
                  <th className="py-3 px-4">موضوع</th>
                  <th className="py-3 px-4">وضعیت</th>
                  <th className="py-3 px-4">تاریخ</th>
                  <th className="py-3 px-4 text-center">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {paginatedMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={(e) => {
                      if (e.target.closest("a,button")) return;
                      router.push(`/admin/messages/${msg.id}`);
                    }}
                    className={`cursor-pointer hover:bg-gray-50/80 transition-colors ${!msg.isRead ? "bg-blue-50/30 font-semibold" : ""}`}
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900">
                        {msg.name}
                      </div>
                      <div className="text-xs text-gray-500 font-normal">
                        {msg.email}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-800">
                      {msg.subject || "بدون موضوع"}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        {isRepliedMsg(msg) ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            پاسخ داده شده
                          </span>
                        ) : msg.isRead ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            خوانده شده
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            جدید
                          </span>
                        )}
                        {Array.isArray(msg.replies) &&
                          msg.replies.length > 0 && (
                            <span className="text-[11px] text-gray-500 font-normal">
                              ({msg.replies.length} پاسخ)
                            </span>
                          )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-500">
                      {msg.createdAt
                        ? new Date(msg.createdAt).toLocaleDateString("fa-IR")
                        : ""}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/messages/${msg.id}`}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition"
                        >
                          مشاهده و پاسخ
                        </Link>
                        <button
                          onClick={() => handleToggleRead(msg.id, msg.isRead)}
                          className="px-3 py-1.5 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg text-xs font-medium transition"
                          title="تغییر وضعیت خوانده شدن"
                        >
                          {msg.isRead ? "خوانده نشده" : "خوانده شد"}
                        </button>
                        <button
                          onClick={() => confirmDelete(msg)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-medium transition"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && pagination.total > 0 && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50/60">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span>
                نمایش {(currentPage - 1) * pageSize + 1}–
                {Math.min(currentPage * pageSize, pagination.total)} از {pagination.total} پیام
              </span>
              <label className="flex items-center gap-1">
                تعداد در صفحه:
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 bg-white border border-gray-200 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[10, 20, 50].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </label>
            </div>

            {totalPages > 1 && (
              <nav className="flex items-center gap-1" aria-label="صفحه‌بندی">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 rounded-md text-xs text-gray-600 hover:bg-white border border-transparent hover:border-gray-200 disabled:opacity-40 disabled:hover:bg-transparent"
                  title="صفحه اول"
                >
                  «
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md text-xs text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                >
                  قبلی
                </button>
                {pageNumbers.map((n, i) =>
                  n === "…" ? (
                    <span key={`e${i}`} className="px-2 text-xs text-gray-400">…</span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => setCurrentPage(n)}
                      aria-current={n === currentPage ? "page" : undefined}
                      className={`min-w-[32px] px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                        n === currentPage
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {n.toLocaleString("fa-IR")}
                    </button>
                  ),
                )}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 rounded-md text-xs text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
                >
                  بعدی
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 rounded-md text-xs text-gray-600 hover:bg-white border border-transparent hover:border-gray-200 disabled:opacity-40 disabled:hover:bg-transparent"
                  title="صفحه آخر"
                >
                  »
                </button>
              </nav>
            )}
          </div>
        )}
      </div>

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-gray-100 text-right">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              تایید حذف پیام
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              آیا از حذف پیام «{messageToDelete?.name}» اطمینان دارید؟ این
              عملیات غیرقابل بازگشت است.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition"
              >
                انصراف
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition disabled:opacity-50"
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
