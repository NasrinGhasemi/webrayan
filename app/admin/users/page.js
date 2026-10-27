"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Button from "@/components/ui/Button";
import Toast from "@/components/ui/Toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Modals & Forms
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: "", role: "user" });
  const [showAddModal, setShowAddModal] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });
  const [deleteModal, setDeleteModal] = useState({ show: false, user: null });
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/users?t=${new Date().getTime()}`, {
        cache: "no-store",
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users || []);
      } else {
        showToast("خطا در دریافت لیست کاربران", "error");
      }
    } catch (error) {
      console.error("Fetch users error:", error);
      showToast("خطا در اتصال به سرور", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle Add User
  const handleAddUser = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const csrfRes = await fetch("/api/csrf-token");
      const csrfData = await csrfRes.json();

      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfData.csrfToken,
        },
        body: JSON.stringify(addFormData),
      });
      const data = await res.json();
      if (data.success) {
        showToast("کاربر جدید با موفقیت ایجاد شد", "success");
        setShowAddModal(false);
        setAddFormData({ name: "", email: "", password: "", role: "user" });
        fetchUsers();
      } else {
        showToast(data.message || "خطا در ایجاد کاربر", "error");
      }
    } catch (error) {
      console.error("Add user error:", error);
      showToast("خطا در ارتباط با سرور", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Edit Init
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name || "",
      role: user.role || "user",
    });
  };

  // Handle Update User
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setSubmitting(true);
    try {
      const csrfRes = await fetch("/api/csrf-token");
      const csrfData = await csrfRes.json();

      const res = await fetch(`/api/admin/users/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfData.csrfToken,
        },
        body: JSON.stringify(editFormData),
      });
      const data = await res.json();
      if (data.success) {
        showToast("اطلاعات کاربر با موفقیت بروزرسانی شد", "success");
        setEditingUser(null);
        fetchUsers();
      } else {
        showToast(data.message || "خطا در بروزرسانی کاربر", "error");
      }
    } catch (error) {
      console.error("Update user error:", error);
      showToast("خطا در ارتباط با سرور", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Delete User
  const confirmDelete = (user) => {
    setDeleteModal({ show: true, user });
  };

  const handleDelete = async () => {
    const user = deleteModal.user;
    if (!user) return;
    setSubmitting(true);
    try {
      const csrfRes = await fetch("/api/csrf-token");
      const csrfData = await csrfRes.json();

      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: "DELETE",
        headers: {
          "x-csrf-token": csrfData.csrfToken,
        },
      });
      const data = await res.json();
      if (data.success) {
        showToast("کاربر با موفقیت حذف شد", "success");
        setDeleteModal({ show: false, user: null });
        fetchUsers();
      } else {
        showToast(data.message || "خطا در حذف کاربر", "error");
      }
    } catch (error) {
      console.error("Delete user error:", error);
      showToast("خطا در ارتباط با سرور", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    users: users.filter((u) => u.role === "user").length,
  };

  if (loading && users.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-vazir">در حال بارگذاری کاربران...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto animate-fadeIn font-vazir" dir="rtl">
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
          <h1 className="text-2xl font-bold text-gray-800">مدیریت کاربران</h1>
          <p className="text-sm text-gray-500 mt-1">
            مشاهده، ویرایش سطح دسترسی و مدیریت حساب‌های کاربری سامانه
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
          >
            <PlusIcon className="w-5 h-5" />
            <span>افزودن کاربر جدید</span>
          </Button>
          <Link
            href="/admin"
            className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all"
          >
            بازگشت به داشبورد
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-lg">
            <UserIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">کل کاربران</p>
            <h3 className="text-xl font-bold text-gray-800 mt-0.5">{stats.total}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">
            <ShieldCheckIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">مدیران سیستم</p>
            <h3 className="text-xl font-bold text-gray-800 mt-0.5">{stats.admins}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
            <UserCircleIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">کاربران عادی</p>
            <h3 className="text-xl font-bold text-gray-800 mt-0.5">{stats.users}</h3>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-gray-400">
            <MagnifyingGlassIcon className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="جستجو بر اساس نام یا ایمیل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 transition-all text-right"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FunnelIcon className="w-4 h-4" />
            <span>نقش:</span>
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-all text-right w-full md:w-44"
          >
            <option value="all">همه نقش‌ها</option>
            <option value="admin">مدیر سیستم</option>
            <option value="user">کاربر عادی</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-4 px-6">کاربر</th>
                <th className="py-4 px-6">ایمیل</th>
                <th className="py-4 px-6">نقش سیستم</th>
                <th className="py-4 px-6">تاریخ عضویت</th>
                <th className="py-4 px-6 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-gray-400">
                    <UserIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>کاربری با این مشخصات یافت نشد.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id || user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shrink-0">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800">{user.name || "بدون نام"}</div>
                        <div className="text-xs text-gray-400">شناسه: {user._id?.slice(-6)}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600 dir-ltr text-right">{user.email}</td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-50 text-purple-700 border border-purple-200/50"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                        }`}
                      >
                        {user.role === "admin" ? "مدیر سیستم" : "کاربر عادی"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 text-xs">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("fa-IR")
                        : "نامشخص"}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          title="ویرایش کاربر"
                          className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(user)}
                          title="حذف کاربر"
                          className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">افزودن کاربر جدید</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">نام و نام خانوادگی</label>
                <input
                  type="text"
                  required
                  value={addFormData.name}
                  onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                  placeholder="مثال: علی احمدی"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">ایمیل</label>
                <input
                  type="email"
                  required
                  value={addFormData.email}
                  onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-right dir-ltr"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">کلمه عبور</label>
                <input
                  type="password"
                  required
                  value={addFormData.password}
                  onChange={(e) => setAddFormData({ ...addFormData, password: e.target.value })}
                  placeholder="حداقل ۶ کاراکتر"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-right dir-ltr"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">نقش دسترسی</label>
                <select
                  value={addFormData.role}
                  onChange={(e) => setAddFormData({ ...addFormData, role: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-right"
                >
                  <option value="user">کاربر عادی</option>
                  <option value="admin">مدیر سیستم</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all"
                >
                  انصراف
                </button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
                >
                  {submitting ? "در حال ذخیره..." : "ایجاد کاربر"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-lg">ویرایش کاربر</h3>
              <button
                onClick={() => setEditingUser(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">نام و نام خانوادگی</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">نقش دسترسی</label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 text-right"
                >
                  <option value="user">کاربر عادی</option>
                  <option value="admin">مدیر سیستم</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all"
                >
                  انصراف
                </button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
                >
                  {submitting ? "در حال بروزرسانی..." : "ذخیره تغییرات"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <ExclamationTriangleIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">حذف حساب کاربری</h3>
              <p className="text-sm text-gray-500 mt-1">
                آیا از حذف کاربر <span className="font-semibold text-gray-800">{deleteModal.user?.name}</span> اطمینان دارید؟ این عمل غیرقابل بازگشت است.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal({ show: false, user: null })}
                className="w-1/2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all"
              >
                انصراف
              </button>
              <Button
                type="button"
                onClick={handleDelete}
                disabled={submitting}
                className="w-1/2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm"
              >
                {submitting ? "در حال حذف..." : "بله، حذف شود"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
