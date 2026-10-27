"use client";
import { useState } from "react";
import Link from "next/link";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const navigation = [
    { name: "صفحه اصلی", href: "/" },
    { name: "خدمات", href: "#", hasSubmenu: true },
    { name: "نمونه کارها", href: "/portfolio" },
    { name: "وبلاگ", href: "/blog" },
    { name: "درباره من", href: "/about" },
    { name: "ارتباط با من", href: "/contact" },
  ];

  // دسته‌بندی شده انواع وب‌سایت - فقط نمایشی
  const servicesMenu = {
    "خدمات شخصی و کسب‌وکار": [
      { name: "سایت شخصی", icon: "👤" },
      { name: "سایت شرکتی", icon: "🏢" },
      { name: "داشبورد و پنل ادمین", icon: "📊" },
    ],
    "فروشگاه و تجارت": [
      { name: "فروشگاه اینترنتی", icon: "🛒" },
      { name: "سایت رستوران و کافه", icon: "🍽️" },
      { name: "سایت املاک", icon: "🏠" },
    ],
    "خدمات تخصصی": [
      { name: "سایت آموزشی", icon: "🎓" },
      { name: "سایت پزشکی", icon: "🏥" },
      { name: "سایت حقوقی", icon: "⚖️" },
      { name: "سایت مالی", icon: "💰" },
    ],
    "فرهنگ و سرگرمی": [
      { name: "سایت فرهنگی/مذهبی", icon: "🕌" },
      { name: "سایت گردشگری", icon: "✈️" },
      { name: "سایت ورزشی", icon: "⚽" },
      { name: "سایت خبری", icon: "📰" },
    ],
  };

  // تایمرها برای تاخیر باز و بسته شدن مگامنو
  let closeTimer = null;
  let openTimer = null;

  const handleMouseEnter = () => {
    // لغو تایمر بسته شدن
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    // اگه منو بسته است، با تاخیر باز کن
    if (!isServicesOpen) {
      openTimer = setTimeout(() => {
        setIsServicesOpen(true);
      }, 200); // تاخیر 200ms برای باز شدن
    }
  };

  const handleMouseLeave = () => {
    // لغو تایمر باز شدن
    if (openTimer) {
      clearTimeout(openTimer);
      openTimer = null;
    }

    // تاخیر برای بسته شدن
    closeTimer = setTimeout(() => {
      setIsServicesOpen(false);
    }, 300); // تاخیر 300ms برای بسته شدن
  };

  return (
    <>
      <header className="bg-linear-to-r from-indigo-100 via-blue-50 to-indigo-100 shadow-lg border-b border-blue-200 fixed w-full top-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center h-16 justify-between">
            {/* لوگو سمت راست */}
            <div className="shrink-0 z-10">
              <Link href="/" className="flex items-center justify-center">
                <div
                  className="flex flex-col items-center justify-center text-center
                           bg-linear-to-r from-blue-500 to-cyan-500 text-white
                           px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-lg font-bold transition-all duration-300
                           hover:scale-105 hover:shadow-lg hover:from-cyan-500 hover:to-blue-500
                           tracking-tight hover:tracking-wide"
                  style={{
                    fontFamily:
                      "'Inter', 'Vazirmatn', 'SF Pro Display', system-ui",
                  }}
                >
                  <span className="text-xs sm:text-base lg:text-lg leading-snug whitespace-nowrap">
                    WebRayanDev.ir
                  </span>
                  <span className="text-[8px] sm:text-[10px] lg:text-xs leading-3 font-bold tracking-wide mt-px whitespace-nowrap">
                    خلق جهان از میان صفر و یک
                  </span>
                </div>
              </Link>
            </div>

            {/* منوهای اصلی وسط - فقط دسکتاپ */}
            <div className="hidden lg:flex items-center space-x-6 space-x-reverse flex-1 justify-center">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  {item.hasSubmenu ? (
                    <div
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      className="relative"
                    >
                      <button className="flex items-center text-gray-800 hover:text-white bg-transparent hover:bg-linear-to-r hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 font-medium text-sm px-4 py-2 rounded-full hover:shadow-md hover:scale-105">
                        {item.name}
                        <svg
                          className={`mr-1 w-4 h-4 transition-transform duration-200 ${isServicesOpen ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {/* مگامنو - دسته‌بندی شده */}
                      {isServicesOpen && (
                        <div
                          className="absolute top-full right-0 mt-1 w-72 bg-linear-to-br from-slate-50 via-white to-blue-50 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 py-4 z-50 max-h-125 overflow-y-auto animate-in slide-in-from-top-2 duration-200"
                          onMouseEnter={handleMouseEnter}
                          onMouseLeave={handleMouseLeave}
                        >
                          <div className="px-4 space-y-4">
                            {Object.entries(servicesMenu).map(
                              ([category, items]) => (
                                <div key={category} className="space-y-2">
                                  <h4 className="text-sm font-bold text-slate-700 px-4 py-3 bg-linear-to-r from-indigo-100 via-purple-50 to-pink-100 rounded-xl border-r-4 border-indigo-400 shadow-lg relative overflow-hidden">
                                    <div className="absolute inset-0 bg-linear-to-r from-indigo-500/10 to-purple-500/10 opacity-50"></div>
                                    <span className="relative">{category}</span>
                                  </h4>
                                  <div className="grid grid-cols-1 gap-1">
                                    {items.map((subItem) => (
                                      <div
                                        key={subItem.name}
                                        className="flex items-center p-3 text-sm rounded-xl text-gray-700 cursor-pointer hover:bg-linear-to-r hover:from-rose-50 hover:via-purple-50 hover:to-indigo-50 hover:text-gray-800 hover:shadow-lg hover:shadow-purple-100/50 transition-all duration-300 group hover:scale-[1.02] border border-transparent hover:border-purple-200/30"
                                      >
                                        <span className="text-lg ml-3 group-hover:scale-110 transition-transform duration-300">
                                          {subItem.icon}
                                        </span>
                                        <span>{subItem.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-800 hover:text-white bg-transparent hover:bg-linear-to-r hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 font-medium text-sm px-4 py-2 rounded-full hover:shadow-md hover:scale-105"
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* دکمه مشاوره رایگان - در موبایل وسط‌چین بین لوگو و همبرگری، در دسکتاپ سمت چپ */}
            <div className="flex-1 lg:flex-none flex items-center justify-center lg:justify-end px-2 z-10">
              <Link
                href="/contact"
                className="bg-linear-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white
                           px-3 py-1.5 text-xs rounded-full font-semibold transition-all duration-300 hover:shadow-md hover:scale-105
                           sm:px-4 sm:py-2 sm:text-sm
                           lg:px-5 lg:py-2.5 lg:text-sm whitespace-nowrap"
              >
                مشاوره رایگان
              </Link>
            </div>

            {/* دکمه منوی همبرگری - سمت چپ موبایل */}
            <div className="lg:hidden shrink-0 z-10">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none rounded transition-colors duration-300 ${
                  isMenuOpen
                    ? "text-red-600 hover:text-red-700"
                    : "text-gray-600 hover:text-cyan-500"
                }`}
                aria-label={isMenuOpen ? "بستن منو" : "باز کردن منو"}
                aria-expanded={isMenuOpen}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* منوی موبایل Full Screen */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-linear-to-br from-blue-100 via-cyan-50 to-blue-100 z-50 overflow-y-auto animate-in fade-in duration-300">
          {/* هدر منو با دکمه بستن */}
          <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-lg">
            <div className="flex-1 flex mr-8">
              <div className="flex flex-col items-center justify-center text-center bg-linear-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl shadow-lg">
                <span className="text-sm font-bold leading-snug">
                  WebRayanDev.ir
                </span>
                <span className="text-[10px] leading-3 font-bold">
                  خلق جهان از میان صفر و یک
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 ml-6 rounded-lg transition-all duration-200 hover:scale-105 shadow-md border border-blue-200"
              aria-label="بستن منو"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* محتوای منو */}
          <div className="container mx-auto px-4 pt-6 max-w-md">
            {/* آیتم‌های منو */}
            <div className="space-y-6">
              {navigation.map((item, index) => (
                <div
                  key={item.name}
                  className="animate-in slide-in-from-right duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.hasSubmenu ? (
                    <div className="bg-white/80 rounded-xl border border-blue-200 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                      <button
                        onClick={() => setIsServicesOpen(!isServicesOpen)}
                        className="flex items-center justify-between w-full py-3.5 px-5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-semibold text-base transition-all duration-200"
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-xl">🎯</span>
                          {item.name}
                        </span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-300 ${isServicesOpen ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>

                      {isServicesOpen && (
                        <div className="px-4 pb-3 space-y-2.5 max-h-96 overflow-y-auto animate-in slide-in-from-top-2 duration-200 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50 bg-linear-to-b from-blue-50/50 to-cyan-50/50">
                          {Object.entries(servicesMenu).map(
                            ([category, items]) => (
                              <div key={category} className="space-y-1.5">
                                <h5 className="text-xs font-bold text-blue-600 px-3 py-2 bg-blue-100 rounded-lg">
                                  {category}
                                </h5>
                                <div className="space-y-1 pr-1">
                                  {items.map((subItem) => (
                                    <div
                                      key={subItem.name}
                                      className="flex items-center py-2 px-3 text-gray-600 rounded-lg text-sm hover:bg-blue-100 hover:text-blue-700 transition-all duration-150 cursor-pointer"
                                    >
                                      <span className="ml-2 text-base">
                                        {subItem.icon}
                                      </span>
                                      <span className="font-medium">
                                        {subItem.name}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 py-3.5 px-5 text-blue-600 bg-white/80 hover:text-blue-700 hover:bg-blue-50 font-semibold text-base rounded-xl transition-all duration-200 hover:shadow-lg border border-blue-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="text-xl">
                        {item.name === "صفحه اصلی" && "🏠"}
                        {item.name === "نمونه کارها" && "💼"}
                        {item.name === "وبلاگ" && "📝"}
                        {item.name === "درباره من" && "👨‍💻"}
                        {item.name === "ارتباط با من" && "📞"}
                      </span>
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* دکمه تماس */}
            <div className="mt-8 pt-4 animate-in slide-in-from-bottom-4 duration-500 delay-500">
              <a
                href="tel:+989166530931"
                className="flex items-center justify-center bg-linear-to-r from-blue-500 to-cyan-500 hover:from-cyan-500 hover:to-blue-500 text-white py-3.5 px-6 rounded-xl font-bold text-base w-full transition-all duration-200 hover:shadow-lg hover:scale-[1.02] shadow-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                تماس با ما
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
