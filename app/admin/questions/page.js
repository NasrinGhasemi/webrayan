"use client";

import { useState, useEffect } from "react";
import AdminShell from "../components/AdminShell";
import Toast from "@/components/ui/Toast";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [toast, setToast] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  // مودال مشاهده و پاسخ
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [adminReplyText, setAdminReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    fetchCsrfToken();
    fetchQuestions();

    // به‌روزرسانی خودکار بدون رفرش
    const refresh = () => {
      if (document.visibilityState === "visible") fetchQuestions(true);
    };
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    const timer = setInterval(refresh, 15000);
    return () => {
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
      clearInterval(timer);
    };
  }, []);

  const fetchCsrfToken = async () => {
    try {
      const res = await fetch("/api/csrf-token");
      const data = await res.json();
      if (data.csrfToken || data.secret) {
        setCsrfToken(data.csrfToken || data.secret);
      }
    } catch (err) {
      console.error("Failed to fetch CSRF token", err);
    }
  };

  const fetchQuestions = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const res = await fetch("/api/admin/questions", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setQuestions(data.data || []);
      } else {
        setToast({ type: "error", message: data.message || "خطا در دریافت سوالات" });
      }
    } catch (err) {
      console.error(err);
      if (!silent) setToast({ type: "error", message: "خطای ارتباط با سرور" });
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/admin/questions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setQuestions((prev) =>
          prev.map((q) => (q.id === id ? { ...q, status: newStatus } : q))
        );
        setToast({ type: "success", message: "وضعیت سوال به‌روز شد" });
      } else {
        setToast({ type: "error", message: data.message || "خطا در به‌روزرسانی" });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "خطای سرور" });
    }
  };

  const handleSendReply = async () => {
    if (!selectedQuestion) return;
    try {
      setReplying(true);
      const res = await fetch(`/api/admin/questions/${selectedQuestion.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify({
          status: "answered",
          adminReply: adminReplyText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === selectedQuestion.id
              ? { ...q, status: "answered", adminReply: adminReplyText }
              : q
          )
        );
        setToast({ type: "success", message: "پاسخ با موفقیت ثبت شد" });
        setViewModalOpen(false);
      } else {
        setToast({ type: "error", message: data.message || "خطا در ثبت پاسخ" });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "خطای سرور" });
    } finally {
      setReplying(false);
    }
  };

  const handleDelete = async () => {
    if (!questionToDelete) return;
    try {
      setDeleting(true);
      const res = await fetch(`/api/admin/questions/${questionToDelete.id}`, {
        method: "DELETE",
        headers: {
          "x-csrf-token": csrfToken,
        },
      });
      const data = await res.json();
      if (data.success) {
        setQuestions((prev) => prev.filter((q) => q.id !== questionToDelete.id));
        setToast({ type: "success", message: "سوال با موفقیت حذف شد" });
        setDeleteModalOpen(false);
      } else {
        setToast({ type: "error", message: data.message || "خطا در حذف سوال" });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "خطای سرور" });
    } finally {
      setDeleting(false);
      setQuestionToDelete(null);
    }
  };

  const isAnswered = (q) => q.status === "answered" || !!q.adminReply?.trim();
  const tabCount = (id) =>
    questions.filter((q) => {
      const a = isAnswered(q);
      const u = q.status === "new";
      if (id === "unread") return u;
      if (id === "read") return !u && !a;
      if (id === "answered") return a;
      if (id === "unanswered") return !a;
      return true;
    }).length;

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.question?.toLowerCase().includes(searchTerm.toLowerCase());

    const answered = isAnswered(q);
    const unread = q.status === "new";
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "unread" && unread) ||
      (statusFilter === "read" && !unread && !answered) ||
      (statusFilter === "answered" && answered) ||
      (statusFilter === "unanswered" && !answered);

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage) || 1;
  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
      <div className="p-6 max-w-7xl mx-auto space-y-6" dir="rtl">
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">مدیریت سوالات متداول کاربران</h1>
            <p className="text-sm text-slate-500 mt-1">
              مشاهده متن کامل سوالات، تغییر وضعیت و پاسخ‌دهی به کاربران.
            </p>
          </div>
        </div>

        {/* فیلترها و جستجو */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
          <input
            type="text"
            placeholder="جستجو در نام، ایمیل یا متن سوال..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-80 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {[
              { id: "all", label: "همه" },
              { id: "unread", label: "خوانده نشده" },
              { id: "read", label: "خوانده شده" },
              { id: "answered", label: "پاسخ داده شده" },
              { id: "unanswered", label: "پاسخ داده نشده" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  statusFilter === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label} ({tabCount(tab.id)})
              </button>
            ))}
          </div>
        </div>

        {/* جدول */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">در حال بارگذاری سوالات...</div>
          ) : paginatedQuestions.length === 0 ? (
            <div className="p-8 text-center text-slate-500">سوالی یافت نشد.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                    <th className="p-4">کاربر</th>
                    <th className="p-4">ایمیل</th>
                    <th className="p-4 max-w-xs">متن سوال</th>
                    <th className="p-4">وضعیت</th>
                    <th className="p-4">تاریخ ثبت</th>
                    <th className="p-4 text-center">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-sm text-slate-700">
                  {paginatedQuestions.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-4 font-medium text-slate-900">{q.name}</td>
                      <td className="p-4 text-slate-500 text-xs dir-ltr text-right">{q.email}</td>
                      <td className="p-4 max-w-xs truncate text-slate-600" title={q.question}>
                        {q.question}
                      </td>
                      <td className="p-4">
                        <select
                          value={q.status}
                          onChange={(e) => handleStatusChange(q.id, e.target.value)}
                          className={`text-xs font-medium px-2.5 py-1 rounded-md border focus:outline-none ${
                            q.status === "new"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : q.status === "reviewing"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : q.status === "answered"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          <option value="new">جدید</option>
                          <option value="reviewing">در حال بررسی</option>
                          <option value="answered">پاسخ داده شده</option>
                          <option value="rejected">رد شده</option>
                        </select>
                      </td>
                      <td className="p-4 text-xs text-slate-400">
                        {new Date(q.createdAt).toLocaleDateString("fa-IR")}
                      </td>
                      <td className="p-4 text-center space-x-2 space-x-reverse">
                        <button
                          onClick={() => {
                            setSelectedQuestion(q);
                            if (q.status === "new") handleStatusChange(q.id, "reviewing");
                            setAdminReplyText(q.adminReply || "");
                            setViewModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-medium transition"
                        >
                          مشاهده و پاسخ
                        </button>
                        <button
                          onClick={() => {
                            setQuestionToDelete(q);
                            setDeleteModalOpen(true);
                          }}
                          className="px-3 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 rounded-lg text-xs font-medium transition"
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* صفحه‌بندی */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded-lg text-xs font-medium ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        {/* مودال مشاهده متن کامل و پاسخ‌دهی */}
        {viewModalOpen && selectedQuestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="text-lg font-bold text-slate-800">جزئیات و پاسخ به سوال</h3>
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-semibold text-slate-600">فرستنده: </span>
                  <span className="text-slate-800">{selectedQuestion.name}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-600">ایمیل: </span>
                  <span className="text-slate-800 dir-ltr inline-block">{selectedQuestion.email}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-600 block mb-1">متن سوال کاربر:</span>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 whitespace-pre-wrap">
                    {selectedQuestion.question}
                  </div>
                </div>

                <div className="pt-2">
                  <label className="font-semibold text-slate-600 block mb-1">متن پاسخ ادمین:</label>
                  <textarea
                    rows={4}
                    value={adminReplyText}
                    onChange={(e) => setAdminReplyText(e.target.value)}
                    placeholder="پاسخ خود را اینجا بنویسید..."
                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  onClick={() => setViewModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200"
                >
                  انصراف
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={replying}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {replying ? "در حال ثبت..." : "ثبت پاسخ و تغییر وضعیت به پاسخ داده شده"}
                </button>
              </div>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
          title="حذف سوال"
          message={`آیا از حذف سوالِ «${questionToDelete?.name}» اطمینان دارید؟`}
          confirmText="حذف"
          cancelText="انصراف"
          loading={deleting}
        />
      </div>
  );
}
