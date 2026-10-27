"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Toast from "@/components/ui/Toast";
import AdminPagination from "@/components/ui/AdminPagination";
import { useRouter } from "next/navigation";

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [counts, setCounts] = useState({ all: 0 });
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, categoryFilter, pageSize]);
  const [toast, setToast] = useState(null);

  // Form Errors State (برای خطاهای فارسی زیر فیلدها)
  const [formErrors, setFormErrors] = useState({});

  // Modal & Form State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Form Data Default State
  const defaultFormData = {
    title: "",
    description: "",
    category: "booking",
    image: "📅",
    demoUrl: "",
    githubUrl: "",
    techInput: "Next.js 15, Tailwind CSS, Prisma, PostgreSQL",
    client: "",
    duration: "",
    year: new Date().getFullYear().toString(),
    published: true,
    featured: false,
    order: 1,
  };

  const [formData, setFormData] = useState(defaultFormData);

  // Categories definition
  const categoryMap = {
    booking: { name: "رزرواسیون و نوبت‌دهی", icon: "📅" },
    ordering: { name: "کافه، رستوران و سفارش", icon: "☕" },
    ecommerce: { name: "فروشگاه آنلاین", icon: "🛍️" },
    corporate: { name: "شرکتی و پورتال", icon: "🏢" },
    education: { name: "آموزشی", icon: "🎓" },
    "web-app": { name: "وب‌اپلیکیشن و سامانه", icon: "⚡" },
    web: { name: "سایر وب‌سایت‌ها", icon: "🌐" },
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Fetch Projects
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
      });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      const res = await fetch(`/api/portfolio?${params}`, {
        cache: "no-store",
      });
      const data = await res.json();

      if (res.ok) {
        const list = Array.isArray(data.projects)
          ? data.projects
          : Array.isArray(data)
            ? data
            : [];
        setProjects(list);
        if (data.pagination) {
          setTotalCount(data.pagination.total);
          setTotalPages(data.pagination.totalPages);
          if (data.pagination.page !== page) setPage(data.pagination.page);
        }
        if (data.counts) setCounts(data.counts);
      } else {
        showToast(data.message || "خطا در دریافت پروژه‌ها", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("خطا در ارتباط با سرور", "error");
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, debouncedSearch, categoryFilter]);

  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingProject(null);
    setFormData(defaultFormData);
    setFormErrors({});
    setModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (proj) => {
    setEditingProject(proj);
    setFormData({
      title: proj.title || "",
      description: proj.description || "",
      category: proj.category || "booking",
      image: proj.image || "🚀",
      demoUrl: proj.demoUrl || "",
      githubUrl: proj.githubUrl || "",
      techInput: Array.isArray(proj.tech)
        ? proj.tech.join(", ")
        : proj.tech || "",
      client: proj.client || "",
      duration: proj.duration || "",
      year: proj.year || new Date().getFullYear().toString(),
      published: proj.published ?? true,
      featured: proj.featured ?? false,
      order: proj.order ?? 0,
    });
    setFormErrors({});
    setModalOpen(true);
  };

  // Handle Input Changes & Clear Errors
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Submit Form (Create / Update with Persian Custom Validation)
  const handleSubmitForm = async (e) => {
    e.preventDefault();

    // Validation
    const errors = {};
    if (!formData.title.trim())
      errors.title = "وارد کردن عنوان پروژه الزامی است.";
    if (!formData.description.trim())
      errors.description = "وارد کردن توضیحات کامل پروژه الزامی است.";
    if (!formData.category.trim())
      errors.category = "انتخاب دسته‌بندی پروژه الزامی است.";

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      showToast("لطفاً خطاهای فرم را برطرف کنید.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const techArray = formData.techInput
        ? formData.techInput
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category.trim(),
        image: formData.image.trim() || "🚀",
        demoUrl: formData.demoUrl.trim() || null,
        githubUrl: formData.githubUrl.trim() || null,
        tech: techArray,
        client: formData.client.trim() || null,
        duration: formData.duration.trim() || null,
        year: formData.year.trim() || null,
        published: Boolean(formData.published),
        featured: Boolean(formData.featured),
        order: parseInt(formData.order) || 0,
      };

      let url = "/api/portfolio";
      let method = "POST";

      if (editingProject) {
        method = "PUT";
        payload.id = editingProject.id;
      }

      // توکن CSRF برای POST/PUT الزامی است
      const csrfRes = await fetch("/api/csrf-token");
      const csrfData = await csrfRes.json();
      const csrfToken = csrfData.token || csrfData.csrfToken;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) console.error("SAVE failed:", res.status, data);

      if (res.ok) {
        showToast(
          editingProject
            ? "پروژه با موفقیت ویرایش شد"
            : "پروژه جدید با موفقیت ایجاد شد",
          "success",
        );
        setModalOpen(false);
        fetchProjects();
        router.refresh(); // این خط باعث رفرش شدن داده‌های سمت سرور و روت‌های وابسته می‌شود
      } else {
        const detail =
          data.message ||
          data.error ||
          (Array.isArray(data.errors) ? JSON.stringify(data.errors) : "") ||
          "خطا در ذخیره اطلاعات پروژه";
        showToast(`${detail} (کد ${res.status})`, "error");
      }
    } catch (err) {
      console.error(err);
      showToast("خطا در ارتباط با سرور", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete Flow
  const confirmDelete = (proj) => {
    setProjectToDelete(proj);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setDeleting(true);
    try {
      // Get CSRF Token if needed

      const csrfRes = await fetch("/api/csrf-token", { cache: "no-store" });
      const csrfData = await csrfRes.json();
      const csrfToken = csrfData.token || csrfData.csrfToken;

      const res = await fetch(
        `/api/portfolio?id=${encodeURIComponent(projectToDelete.id)}`,
        {
          method: "DELETE",
          headers: { "x-csrf-token": csrfToken },
        },
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) console.error("DELETE failed:", res.status, data);

      if (res.ok) {
        showToast("پروژه با موفقیت حذف شد", "success");
        setDeleteModalOpen(false);
        setProjectToDelete(null);
        fetchProjects();
      } else {
        showToast(
          `${data.message || data.error || "خطا در حذف پروژه"} (کد ${res.status})`,
          "error",
        );
      }
    } catch (err) {
      console.error(err);
      showToast("خطا در ارتباط با سرور", "error");
    } finally {
      setDeleting(false);
    }
  };

  // Filter Projects
  // Filtering and pagination are done on the server
  const filteredProjects = projects;

  return (
    <div className="p-6 max-w-7xl mx-auto font-vazir text-right" dir="rtl">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            مدیریت نمونه‌کارها و پروژه‌ها
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            افزودن، ویرایش و سازماندهی پروژه‌های وب‌رایان برای نمایش در سایت
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
          >
            ← بازگشت به داشبورد
          </Link>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <span>+</span> افزودن پروژه جدید
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          <button
            onClick={() => setCategoryFilter("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              categoryFilter === "all"
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            🎯 همه ({(counts.all ?? 0).toLocaleString("fa-IR")})
          </button>
          {Object.entries(categoryMap).map(([key, val]) => {
            const count = counts[key] ?? 0;
            if (count === 0 && categoryFilter !== key) return null;
            return (
              <button
                key={key}
                onClick={() => setCategoryFilter(key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                  categoryFilter === key
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <span>{val.icon}</span>
                <span>{val.name}</span>
                <span className="bg-white/20 px-1.5 py-0.5 rounded-md text-[10px]">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="جستجو در عنوان یا توضیحات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
          />
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-slate-100">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-sm font-medium text-slate-500">
            در حال بارگذاری پروژه‌ها...
          </p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 p-8">
          <div className="text-5xl mb-3">📁</div>
          <h3 className="text-lg font-bold text-slate-700 mb-1">
            هیچ پروژه‌ای یافت نشد
          </h3>
          <p className="text-sm text-slate-400 mb-6">
            می‌توانید اولین پروژه نمونه‌کار خود را اضافه کنید.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all"
          >
            افزودن پروژه جدید
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => {
            const catInfo = categoryMap[proj.category] || {
              name: proj.category,
              icon: "🌐",
            };
            return (
              <div
                key={proj.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden group"
              >
                {/* Card Top Banner */}
                <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50/30 border-b border-slate-100 flex items-start justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {proj.image || "🚀"}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {proj.featured && (
                      <span className="px-2 py-1 bg-amber-50 text-amber-700 border border-amber-200/60 rounded-lg text-[10px] font-bold">
                        ⭐ ویژه
                      </span>
                    )}
                    <span
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold ${proj.published ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60" : "bg-slate-100 text-slate-600"}`}
                    >
                      {proj.published ? "منتشر شده" : "پیش‌نویس"}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg flex items-center gap-1">
                      <span>{catInfo.icon}</span>
                      <span>{catInfo.name}</span>
                    </span>
                    {proj.year && (
                      <span className="text-xs text-slate-400 font-medium">
                        سال: {proj.year}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
                    {proj.description}
                  </p>

                  {/* Tech Tags */}
                  {proj.tech &&
                    Array.isArray(proj.tech) &&
                    proj.tech.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4 mt-auto">
                        {proj.tech.slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium"
                          >
                            {t}
                          </span>
                        ))}
                        {proj.tech.length > 3 && (
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded-md text-[10px]">
                            +{proj.tech.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                  {/* Links / Client */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{proj.client || "پروژه شخصی"}</span>
                    <div className="flex items-center gap-2">
                      {proj.demoUrl && (
                        <a
                          href={proj.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          پیش‌نمایش ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-6 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    اولویت نمایش: {proj.order}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(proj)}
                      className="px-3 py-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
                    >
                      ویرایش
                    </button>
                    <button
                      onClick={() => confirmDelete(proj)}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-all"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && (
        <AdminPagination
          page={page}
          totalPages={totalPages}
          total={totalCount}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-slate-800">
                {editingProject ? "✏️ ویرایش پروژه" : "➕ افزودن پروژه جدید"}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleSubmitForm}
              noValidate
              className="p-6 space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    عنوان پروژه *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="مثلاً: سامانه هوشمند رزرواسیون نوبت‌یار"
                    className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 ${
                      formErrors.title
                        ? "border-rose-500 focus:ring-rose-500/20"
                        : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-600"
                    }`}
                  />
                  {formErrors.title && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">
                      {formErrors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    دسته‌بندی (Category) *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 ${
                      formErrors.category
                        ? "border-rose-500 focus:ring-rose-500/20"
                        : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-600"
                    }`}
                  >
                    <option value="booking">
                      📅 رزرواسیون و نوبت‌دهی (booking)
                    </option>
                    <option value="ordering">
                      ☕ کافه، رستوران و سفارش (ordering)
                    </option>
                    <option value="ecommerce">
                      🛍️ فروشگاه آنلاین (ecommerce)
                    </option>
                    <option value="corporate">
                      🏢 شرکتی و پورتال (corporate)
                    </option>
                    <option value="education">🎓 آموزشی (education)</option>
                    <option value="web-app">
                      ⚡ وب‌اپلیکیشن و سامانه (web-app)
                    </option>
                    <option value="web">🌐 سایر وب‌سایت‌ها (web)</option>
                  </select>
                  {formErrors.category && (
                    <p className="mt-1 text-xs text-rose-600 font-medium">
                      {formErrors.category}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  توضیحات کامل پروژه *
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="توضیح کوتاه درباره ماهیت، چالش‌ها و ارزش‌آفرینی پروژه..."
                  className={`w-full px-4 py-2.5 text-sm bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 ${
                    formErrors.description
                      ? "border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-200 focus:ring-blue-500/20 focus:border-blue-600"
                  }`}
                ></textarea>
                {formErrors.description && (
                  <p className="mt-1 text-xs text-rose-600 font-medium">
                    {formErrors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    آیکون / ایموجی نمایشی
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="📅 یا 🛍️"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    تکنولوژی‌ها (با کاما جدا کنید)
                  </label>
                  <input
                    type="text"
                    name="techInput"
                    value={formData.techInput}
                    onChange={handleChange}
                    placeholder="Next.js, Tailwind CSS, Prisma"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    لینک پیش‌نمایش زنده (Demo URL)
                  </label>
                  <input
                    type="text"
                    name="demoUrl"
                    value={formData.demoUrl}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    لینک مخزن گیت‌هاب (GitHub)
                  </label>
                  <input
                    type="text"
                    name="githubUrl"
                    value={formData.githubUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    مشتری / کارفرما
                  </label>
                  <input
                    type="text"
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    placeholder="پروژه شخصی / نام سالن"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    مدت زمان اجرا
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="مثلاً: ۲ ماه"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    سال انتشار
                  </label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="1403"
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    اولویت نمایش (Order)
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="published"
                      checked={formData.published}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-700">
                      انتشار در سایت
                    </span>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-amber-700">
                      ⭐ پروژه ویژه (Featured)
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                >
                  {submitting && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  <span>
                    {editingProject ? "ذخیره تغییرات" : "ایجاد پروژه"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-4">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">حذف پروژه</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              آیا از حذف پروژه{" "}
              <span className="font-bold text-slate-700">
                «{projectToDelete?.title}»
              </span>{" "}
              اطمینان دارید؟ این عملیات قابل بازگشت نیست.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                انصراف
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 rounded-xl shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2"
              >
                {deleting && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span>بله، حذف شود</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
