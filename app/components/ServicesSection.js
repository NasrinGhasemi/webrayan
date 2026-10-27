import Link from 'next/link';

export default function ServicesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">خدمات ویژه ما</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            با تیمی از متخصصان، بهترین راه‌حل‌های دیجیتال را برای کسب‌وکارتان ارائه می‌دهیم
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: '💻',
              title: 'طراحی وب‌سایت',
              description: 'طراحی و توسعه وب‌سایت‌های مدرن و واکنش‌گرا با تکنولوژی‌های روز دنیا'
            },
            {
              icon: '🛒',
              title: 'فروشگاه آنلاین',
              description: 'ایجاد فروشگاه‌های آنلاین قدرتمند با امکانات کامل مدیریت و فروش'
            },
            {
              icon: '📱',
              title: 'اپلیکیشن موبایل',
              description: 'توسعه اپلیکیشن‌های موبایل نیتیو و کراس پلتفرم برای iOS و Android'
            },
            {
              icon: '🎨',
              title: 'طراحی UI/UX',
              description: 'طراحی رابط کاربری زیبا و تجربه کاربری بهینه برای محصولات دیجیتال'
            },
            {
              icon: '🚀',
              title: 'بهینه‌سازی سئو',
              description: 'بهینه‌سازی وب‌سایت برای موتورهای جستجو و افزایش رتبه در گوگل'
            },
            {
              icon: '🔧',
              title: 'نگهداری و پشتیبانی',
              description: 'خدمات نگهداری، به‌روزرسانی و پشتیبانی فنی ۲۴ ساعته وب‌سایت شما'
            }
          ].map((service, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-200 hover:border-blue-300 group">
              <div className="text-center">
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>
                <Link 
                  href={`/services/${service.title.replace(/\s+/g, '-').toLowerCase()}`}
                  className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-full hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-1"
                >
                  اطلاعات بیشتر
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
