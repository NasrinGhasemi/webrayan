"use client";

import { useState, useMemo, useEffect } from "react";
import CategoryFilter from "./CategoryFilter";
import ProjectModal from "./ProjectModal";
import { PortfolioSkeleton } from "./LoadingSkeleton";

// دسته‌بندی‌های کاملاً هماهنگ با پنل ادمین و CategoryFilter
const CATEGORIES = [
  { id: "all", name: "همه پروژه‌ها", icon: "🎯" },
  { id: "booking", name: "رزرواسیون و نوبت‌دهی", icon: "📅" },
  { id: "ordering", name: "کافه، رستوران و سفارش", icon: "☕" },
  { id: "ecommerce", name: "فروشگاه آنلاین", icon: "🛍️" },
  { id: "corporate", name: "شرکتی و پورتال", icon: "🏢" },
  { id: "education", name: "آموزشی", icon: "🎓" },
  { id: "web-app", name: "وب‌اپلیکیشن و سامانه", icon: "⚡" },
];

// پروژه‌های نمونه پیش‌فرض (در صورت خالی بودن دیتابیس یا خطا)
const PROJECTS_DATA = [
  {
    id: 1,
    category: "ecommerce",
    title: "فروشگاه آنلاین",
    description: "منوی آنلاین و رزرو میز",
    image: "☕",
    demoUrl: "#",
    client: "مشتری نمونه",
  },
  {
    id: 2,
    category: "booking",
    title: "رزرواسیون و نوبت‌دهی",
    description: "معرفی نمونه‌کارها و بلاگ شخصی",
    image: "👤",
    demoUrl: "#",
    client: "مشتری نمونه",
  },
  {
    id: 3,
    category: "web-app",
    title: "وب‌اپلیکیشن و سامانه",
    description: "فروشگاه کامل با درگاه پرداخت و فیلتر محصولات",
    image: "🛒",
    demoUrl: "#",
    client: "مشتری نمونه",
  },
  {
    id: 4,
    category: "ordering",
    title: "کافه، رستوران و سفارش",
    description: "نمایش اخبار زنده و عضویت خبرنامه",
    image: "📰",
    demoUrl: "#",
    client: "مشتری نمونه",
  },
  {
    id: 5,
    category: "corporate",
    title: "شرکتی و پورتال",
    description: "دوره‌های ویدیویی و آزمون آنلاین",
    image: "📚",
    demoUrl: "#",
    client: "مشتری نمونه",
  },
];

export default function PortfolioSection() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // دریافت پورتفولیو از API با cache: 'no-store' برای به‌روزرسانی آنی
  useEffect(() => {
    const fetchProjects = async (silent = false) => {
      if (!silent) setLoading(true);

      try {
        const response = await fetch(`/api/portfolio?published=true&limit=20&t=${Date.now()}`, {
          cache: 'no-store',
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success && Array.isArray(data.projects)) {
            setProjects(data.projects);
          }
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();

    // به‌روزرسانی خودکار: هنگام بازگشت به تب و هر ۳۰ ثانیه
    const refresh = () => {
      if (document.visibilityState === 'visible') fetchProjects(true);
    };
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    const timer = setInterval(refresh, 30000);
    return () => {
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
      clearInterval(timer);
    };
  }, []);


  // فیلتر کردن پروژه‌ها بر اساس دسته‌بندی انتخاب‌شده
  const filteredProjects = useMemo(() => {
    if (selectedCategory === "all") return projects;
    return projects.filter((project) => project.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <section
      aria-labelledby="portfolio-title"
      className="relative py-20 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200 overflow-hidden"
      id="portfolio"
    >
      {/* عناصر پس‌زمینه تزئینی */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* هدر بخش پورتفولیو */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20 mb-8">
            <span className="text-2xl">💼</span>
            <span className="text-sm font-semibold text-blue-800">
              نمونه کارهای ما
            </span>
          </div>

          <h2
            id="portfolio-title"
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              نمونه‌کارهای ما
            </span>
          </h2>

          <p className="text-xl text-blue-700 max-w-3xl mx-auto leading-relaxed">
            پروژه‌هایی که با عشق، دقت و استفاده از جدیدترین تکنولوژی‌ها ساخته
            ایم:
          </p>

          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* کامپوننت فیلتر دسته‌بندی */}
        <CategoryFilter
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* گرید پروژه‌ها */}
        {loading && projects.length === 0 ? (
          <PortfolioSkeleton count={6} />
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
            <span className="text-5xl mb-4 block">🔍</span>
            <p className="text-lg text-blue-800 font-medium">
              پروژه‌ای در این دسته‌بندی یافت نشد.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {filteredProjects.map((project) => (
              <article
                key={project.id || project._id}
                onClick={() => setSelectedProject(project)}
                className="group bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:bg-blue-50 hover:shadow-2xl p-8 flex flex-col items-center text-center transition-all duration-500 hover:scale-105 hover:-translate-y-2 cursor-pointer relative overflow-hidden"
                style={{ minHeight: "280px" }}
              >
                {/* دایره آیکون پروژه */}
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-4xl shadow-md group-hover:scale-110 transition-transform duration-500 mb-6">
                  {project.image || "🚀"}
                </div>

                <h3 className="text-xl font-bold text-blue-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {project.title}
                </h3>

                <p className="text-blue-700 text-sm leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>

                {/* چیپ‌های سال و مدت‌زمان در صورت وجود */}
                <div className="flex items-center gap-2 mt-auto">
                  {project.year && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                      {project.year}
                    </span>
                  )}
                  {project.duration && (
                    <span className="text-xs bg-green-50 text-green-600 px-3 py-1 rounded-full font-medium">
                      {project.duration}
                    </span>
                  )}
                </div>

                {/* المان‌های تزئینی گوشه کارت */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/20 rounded-bl-full pointer-events-none group-hover:bg-blue-300/30 transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-purple-200/20 rounded-tr-full pointer-events-none group-hover:bg-purple-300/30 transition-colors"></div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* مودال جزئیات پروژه */}
      <ProjectModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
