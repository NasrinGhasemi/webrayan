'use client';
import { useState, memo } from 'react';

/**
 * داده‌های نظرات مشتریان - در آینده از API خواهد آمد
 */
const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: 'احمد محمدی',
    position: 'مدیرعامل شرکت فناوری نوین',
    company: 'شرکت فناوری نوین',
    image: '👨‍💼',
    rating: 5,
    text: 'کیفیت کار و تعهد تیم وب‌رایان فوق‌العاده بود. پروژه ما در زمان مقرر و با بالاترین کیفیت تحویل شد. قطعاً برای پروژه‌های بعدی با آن‌ها همکاری خواهیم کرد.',
    project: 'طراحی وب‌سایت شرکتی',
    date: '۱۴۰۳/۰۸/۱۵',
  },
  {
    id: 2,
    name: 'فاطمه احمدی',
    position: 'بنیان‌گذار استارتاپ فشن',
    company: 'فروشگاه آنلاین مد و پوشاک',
    image: '👩‍💼',
    rating: 5,
    text: 'فروشگاه آنلاین ما با طراحی مدرن و امکانات کاملی که تیم وب‌رایان ایجاد کرد، فروش ما ۳۰۰٪ افزایش یافت. تجربه همکاری بسیار مثبتی بود.',
    project: 'فروشگاه آنلاین',
    date: '۱۴۰۳/۰۷/۲۳',
  },
  {
    id: 3,
    name: 'رضا کریمی',
    position: 'مدیر فناوری اطلاعات',
    company: 'شرکت مشاوره مدیریت',
    image: '👨‍💻',
    rating: 5,
    text: 'سیستم مدیریت پروژه که برای ما طراحی کردند، کاملاً نیازهای ما را برطرف کرد. رابط کاربری بسیار ساده و کارآمد است. تیم حرفه‌ای و قابل اعتماد.',
    project: 'سیستم مدیریت پروژه',
    date: '۱۴۰۳/۰۶/۱۰',
  },
  {
    id: 4,
    name: 'مریم صادقی',
    position: 'مدیر محتوا',
    company: 'رسانه دیجیتال',
    image: '👩‍🎨',
    rating: 5,
    text: 'وب‌سایت خبری ما با سیستم مدیریت محتوای قدرتمند و طراحی زیبا، تعداد بازدیدکنندگان ما را دو برابر کرد. از سرعت و کیفیت کار بسیار راضی هستیم.',
    project: 'پورتال خبری',
    date: '۱۴۰۳/۰۵/۲۸',
  },
  {
    id: 5,
    name: 'علی حسینی',
    position: 'تحلیل‌گر داده',
    company: 'شرکت داده‌کاوی',
    image: '👨‍🔬',
    rating: 5,
    text: 'داشبورد آنالیتیک که برای ما ساختند، دقیقاً همان چیزی بود که نیاز داشتیم. چارت‌های تعاملی و گزارش‌گیری پیشرفته، کار ما را خیلی راحت کرد.',
    project: 'داشبورد آنالیتیک',
    date: '۱۴۰۳/۰۴/۱۲',
  },
  {
    id: 6,
    name: 'زهرا موسوی',
    position: 'مدیر فروش آنلاین',
    company: 'زنجیره فروشگاهی',
    image: '👩‍💼',
    rating: 5,
    text: 'سیستم فروشگاه آنلاین با قابلیت ارسال و مدیریت موجودی که طراحی کردند، فرآیند کاری ما را کاملاً متحول کرد. پشتیبانی عالی و به‌روزرسانی‌های منظم.',
    project: 'سوپرمارکت آنلاین',
    date: '۱۴۰۳/۰۳/۰۵',
  },
];

const ClientTestimonials = memo(function ClientTestimonials({
  className = '',
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(prev =>
        prev === TESTIMONIALS_DATA.length - 1 ? 0 : prev + 1
      );
      setIsTransitioning(false);
    }, 150);
  };

  const handlePrev = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(prev =>
        prev === 0 ? TESTIMONIALS_DATA.length - 1 : prev - 1
      );
      setIsTransitioning(false);
    }, 150);
  };

  const goToSlide = index => {
    if (isTransitioning || index === currentIndex) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 150);
  };

  const currentTestimonial = TESTIMONIALS_DATA[currentIndex];

  return (
    <section
      className={`relative py-20 bg-gradient-to-br from-blue-100 via-purple-100 to-indigo-200 overflow-hidden ${className}`}
    >
      {/* Background Pattern - مشابه صفحات دیگر */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full mix-blend-multiply filter blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300 to-indigo-300 rounded-full mix-blend-multiply filter blur-2xl transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-orange-200 to-red-200 rounded-full mix-blend-multiply filter blur-2xl transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-white/20 mb-8">
            <span className="text-4xl" role="img" aria-label="نظرات مشتریان">
              💬
            </span>
            <span className="text-blue-600 font-semibold">نظرات مشتریان</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              نظرات مشتریان
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 drop-shadow-2xl shadow-amber-500/40 tracking-wider font-extrabold mt-2">
              وب‌رایان
            </span>
          </h2>

          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            آنچه مشتریان ما درباره کیفیت خدمات و نحوه همکاری‌مان می‌گویند
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Main Testimonial */}
        <div className="max-w-4xl mx-auto">
          <div
            className={`bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12 text-center shadow-lg hover:shadow-2xl transition-all duration-500 ${
              isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            {/* Client Avatar */}
            <div className="text-6xl mb-6" aria-hidden="true">
              {currentTestimonial.image}
            </div>

            {/* Rating */}
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-6 h-6 ${
                    i < currentTestimonial.rating
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>

            {/* Testimonial Text */}
            <blockquote className="text-xl text-gray-700 leading-relaxed mb-8 italic">
              &ldquo;{currentTestimonial.text}&rdquo;
            </blockquote>

            {/* Client Info */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {currentTestimonial.name}
              </h3>
              <p className="text-gray-600 mb-2">
                {currentTestimonial.position}
              </p>
              <p className="text-sm text-gray-500 mb-2">
                {currentTestimonial.company}
              </p>
              <div className="flex justify-center items-center gap-4 text-sm text-gray-400">
                <span>{currentTestimonial.project}</span>
                <span>•</span>
                <span>{currentTestimonial.date}</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="نظر قبلی"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {TESTIMONIALS_DATA.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 scale-125 shadow-lg'
                      : 'bg-white/60 hover:bg-blue-200 hover:scale-110 border border-white/20'
                  }`}
                  aria-label={`نظر ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="p-3 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 text-gray-600 hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="نظر بعدی"
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: '98%', label: 'رضایت مشتریان', icon: '⭐' },
            { number: '100%', label: 'تحویل به موقع', icon: '⏰' },
            { number: '24/7', label: 'پشتیبانی', icon: '📞' },
            { number: '3 سال', label: 'گارانتی', icon: '🛡️' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-700 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default ClientTestimonials;
