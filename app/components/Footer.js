"use client";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "صفحه اصلی", href: "/" },
    { name: "نمونه کارها", href: "/portfolio" },
    { name: "درباره من", href: "/about" },
    { name: "تماس با من", href: "/contact" },
  ];

  const services = [
    { name: "طراحی و توسعه وب‌سایت", href: "/services/website-development" },
    { name: "طراحی قالب اختصاصی", href: "/services/custom-templates" },
    { name: "داشبورد و پنل ادمین", href: "/services/admin-dashboard" },
  ];

  const socialLinks = [
    {
      name: "اینستاگرام",
      href: "https://instagram.com/webrayan_dev",
      bgColor: "from-purple-600 via-pink-500 to-orange-400",
      icon: (
        <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "تلگرام",
      href: "https://t.me/webrayandev",
      bgColor: "from-blue-400 to-blue-600",
      icon: (
        <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
    {
      name: "لینکدین",
      href: "https://linkedin.com/in/nasringhasemi",
      bgColor: "from-blue-600 to-blue-700",
      icon: (
        <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      name: "گیت‌هاب",
      href: "https://github.com/nasringhasemi",
      bgColor: "from-gray-800 to-gray-900",
      icon: (
        <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-80 h-80 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      {/* بخش اصلی Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* بخش اول: اطلاعات تماس */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-center">
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                وب‌رایان
              </span>
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-center">
              <span>
                طراحی و توسعه وب‌سایت‌های حرفه‌ای با تکنولوژی‌های روز دنیا
              </span>
            </p>

            <div className="text-gray-300 text-xs sm:text-sm space-y-2 sm:space-y-3 flex flex-col items-start pr-8 sm:pr-12">
              <div className="flex items-center gap-2 sm:gap-3">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0"
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
                <a
                  href="tel:+989166530931"
                  className="hover:text-amber-400 transition-colors"
                >
                  09166530931
                </a>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:info@webrayandev.ir"
                  className="hover:text-amber-400 transition-colors break-all"
                >
                  info@webrayandev.ir
                </a>
              </div>

              <div className="flex items-start gap-2 sm:gap-3">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 mt-0.5 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-xs sm:text-sm">
                  ایران، خوزستان، بندرماهشهر
                </span>
              </div>
            </div>
          </div>

          {/* بخش دوم: لینک‌های سریع */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-right pr-8 sm:pr-12">
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                لینک‌های سریع
              </span>
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 text-right pr-8 sm:pr-12">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-amber-400 transition-colors text-xs sm:text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* بخش سوم: خدمات */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-right pr-8 sm:pr-12">
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                خدمات ما
              </span>
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 text-right pr-8 sm:pr-12">
              {services.map((service, index) => (
                <li key={index}>
                  <span className="text-gray-300 hover:text-amber-400 transition-colors text-xs sm:text-sm cursor-default">
                    {service.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* بخش چهارم: شبکه‌های اجتماعی */}
          <div className="space-y-3 sm:space-y-4 text-center">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                ما را در شبکه های اجتماعی دنبال کنید:
              </span>
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 sm:gap-3 bg-white/10 hover:bg-white/20 px-2 py-2 sm:px-4 sm:py-3 rounded-xl
                           transition-all duration-300 border border-white/20 hover:border-white/40
                           hover:shadow-lg backdrop-blur-sm hover:scale-105"
                  title={social.name}
                >
                  <div
                    className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br ${social.bgColor}
                                rounded-lg flex items-center justify-center transition-all duration-300
                                group-hover:scale-110 group-hover:shadow-lg`}
                  >
                    {social.icon}
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-gray-200 group-hover:hover:text-amber-400 transition-colors duration-300">
                    {social.name}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* خط جداکننده */}
      <div className="h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent"></div>

      {/* بخش پایین: حقوق کپی‌رایت */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 relative z-10">
        <div className="flex justify-center items-center">
          <div className="text-center">
            <p className="text-gray-300 text-xs sm:text-sm">
              © تمامی حقوق این سایت متعلق به{" "}
              <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent font-semibold">
                وب‌رایان
              </span>{" "}
              می باشد.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
