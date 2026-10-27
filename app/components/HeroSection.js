"use client";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full mix-blend-multiply filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-shadow-lg">
            طراحی وب سایت های اختصاصی با
            <span className="block text-yellow-400 sm:text-yellow-500 font-extrabold mt-2">
              وب‌رایان
            </span>
          </h1>
          <br className="hidden sm:block" />

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-50 mb-4 sm:mb-6 leading-relaxed max-w-3xl mx-auto px-2">
            ما در وب‌رایان ایده‌های شما را با بهره‌گیری از تکنولوژی‌های پیشرفته
            به وب‌سایت‌هایی سریع، ایمن و کاربرپسند تبدیل می‌کنیم.
          </p>
          <br className="hidden sm:block" />

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-10 lg:mb-12 px-4">
            <Link
              href="/contact"
              className="btn-primary w-full sm:w-auto text-center text-sm sm:text-base py-3 sm:py-3.5 px-6 sm:px-8"
            >
              مشاوره رایگان
            </Link>
            <Link
              href="/portfolio"
              className="btn-secondary-dark w-full sm:w-auto text-center text-sm sm:text-base py-3 sm:py-3.5 px-6 sm:px-8"
            >
              نمونه کارها
            </Link>
          </div>

          <div className="mb-6 sm:mb-8 px-2">
            <p className="text-orange-200 mb-3 sm:mb-4 text-base sm:text-lg">
              تکنولوژی‌های مورد استفاده:
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {["PostgreSQL", "Prisma", "Next.js", "React", "TailwindCSS"].map(
                (tech, index) => (
                  <span
                    key={index}
                    className="bg-indigo-800 bg-opacity-80 text-orange-100 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm border border-indigo-400 border-opacity-50 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:border-cyan-300 hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    {tech}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="block animate-bounce mt-10 sm:mt-16 lg:mt-20">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 mx-auto text-orange-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
