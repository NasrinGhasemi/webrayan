'use client';
import Link from 'next/link';

export default function ServicesPreview() {
  const services = [
    {
      title: 'طراحی و توسعه وب‌سایت',
      description:
        'توسعه انواع وب‌سایت با تکنولوژی‌های مدرن و طراحی منحصربه‌فرد',
      icon: '🌐',
      gradient: 'from-blue-500 to-cyan-500',
      link: '/services/website-development',
    },
    {
      title: 'طراحی قالب اختصاصی',
      description:
        'طراحی قالب‌های اختصاصی و منحصربه‌فرد متناسب با برند و نیازهای شما',
      icon: '🎨',
      gradient: 'from-purple-500 to-pink-500',
      link: '/services/custom-templates',
    },
    {
      title: 'پنل ادمین و داشبورد اختصاصی',
      description:
        'طراحی پنل های مدیریتی پیشرفته جهت کنترل هوشمندانه محتوا و کاربران',
      icon: '📊',
      gradient: 'from-emerald-500 to-teal-500',
      link: '/services/admin-dashboard',
    },

  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200 py-12 sm:py-16 lg:py-20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute top-1/2 left-1/3 w-32 h-32 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute top-20 right-1/4 w-28 h-28 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '3s' }}
        ></div>
        <div
          className="absolute bottom-10 left-1/4 w-36 h-36 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '4s' }}
        ></div>
        <div
          className="absolute top-1/3 right-10 w-24 h-24 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '2.5s' }}
        ></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* عنوان */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <div className="inline-block mb-3 sm:mb-4">
            <span className="text-blue-900 text-base sm:text-lg md:text-xl font-semibold tracking-wider uppercase">
              ✨ خدمات حرفه‌ای ✨
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 md:mb-6 leading-tight px-2">
            <span className="text-blue-700">
              خدمات ویژه{' '}
            </span>
            <span className="text-blue-700 font-extrabold">
              وب‌رایان
            </span>
          </h2>
          <p className="text-base sm:text-base md:text-lg lg:text-xl text-blue-600 max-w-3xl mx-auto leading-relaxed px-4">
            با تکنولوژی‌های روز دنیا و تجربه‌ای غنی، بهترین خدمات را ارائه
            می‌دهیم!
          </p>
        </div>

        {/* کارت‌ها */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-blue/90 hover:bg-blue-50 hover:border-blue/90 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl
                         transition-all duration-500 flex flex-col justify-center items-center text-center p-5 sm:p-6 md:p-8 min-h-[240px] sm:min-h-[280px] md:min-h-[320px]
                         hover:-translate-y-3 hover:scale-[1.02] border border-white/50
                        "
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="flex justify-center mb-3 sm:mb-4 md:mb-6">
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${service.gradient}
                              flex items-center justify-center shadow-lg group-hover:shadow-xl
                              group-hover:scale-110 transition-all duration-300 ring-4 ring-white/60
                              group-hover:ring-white/90 group-hover:rotate-3`}
                >
                  <span className="text-white text-xl sm:text-2xl md:text-[32px] flex items-center justify-center">
                    {service.icon}
                  </span>
                </div>
              </div>

              <h3 className="text-base sm:text-lg md:text-xl font-bold text-blue-800 bg-clip-text mb-2 sm:mb-3 md:mb-4 group-hover:from-gray-800 group-hover:to-gray-600 transition-all duration-300">
                {service.title}
              </h3>
              <p className="text-blue-600 group-hover:text-blue-600 mb-4 sm:mb-6 md:mb-8 leading-relaxed text-sm sm:text-sm md:text-base transition-colors duration-300">
                {service.description}
              </p>

              {/* <Link
                href={service.link}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500
                         text-white font-bold rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500
                         transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span>اطلاعات بیشتر</span>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Link> */}
            </div>
          ))}
        </div>

        {/* دکمه همه خدمات */}
        {/* <div className="text-center">
          <Link
            href="/services"
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500
                     text-white font-bold rounded-xl hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500
                     transition-all duration-300 hover:scale-105 shadow-lg group focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2"
          >
            <span>مشاهده همه خدمات</span>
            <svg
              className="w-5 h-5 ml-1 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
          </Link>
        </div> */}
      </div>
    </section>
  );
}
