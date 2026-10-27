import Link from 'next/link';
import PortfolioSection from '../components/PortfolioSection';


// Metadata برای SEO
export const metadata = {
  title: 'نمونه کارها | وب‌رایان - طراحی و توسعه وب‌سایت',
  description:
    'مشاهده نمونه کارهای ما در زمینه طراحی وب‌سایت، فروشگاه آنلاین، وب‌اپلیکیشن و پروژه‌های مختلف با تکنولوژی‌های مدرن',
  keywords:
    'نمونه کار, پورتفولیو, طراحی وب‌سایت, فروشگاه آنلاین, وب اپلیکیشن, Next.js, React',
  openGraph: {
    title: 'نمونه کارها | وب‌رایان',
    description: 'مجموعه‌ای از پروژه‌های موفق انجام شده با تکنولوژی‌های مدرن',
    type: 'website',
    locale: 'fa_IR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'نمونه کارها | وب‌رایان',
    description: 'مجموعه‌ای از پروژه‌های موفق انجام شده با تکنولوژی‌های مدرن',
  },
  alternates: {
    canonical: 'https://webrayandev.ir/portfolio',
  },
};

export default function PortfolioPage() {
  // JSON-LD Structured Data برای SEO
  const portfolioStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: 'نمونه کارهای وب‌رایان',
    description:
      'مجموعه‌ای از پروژه‌های موفق انجام شده در زمینه طراحی وب‌سایت، فروشگاه آنلاین و وب‌اپلیکیشن',
    creator: {
      '@type': 'Organization',
      name: 'وب‌رایان',
      url: 'https://webrayandev.ir',
    },
    url: 'https://webrayandev.ir/portfolio',
    workExample: [
      {
        '@type': 'WebSite',
        name: 'شرکت فناوری نوین',
        description: 'طراحی سایت شرکتی مدرن با پنل مدیریت',
        programmingLanguage: ['Next.js', 'Tailwind CSS', 'PostgreSQL'],
      },
      {
        '@type': 'WebApplication',
        name: 'فروشگاه آنلاین مد و پوشاک',
        description: 'فروشگاه کامل با درگاه پرداخت و پنل فروشنده',
        programmingLanguage: ['React', 'Node.js', 'Stripe', 'PostgreSQL'],
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(portfolioStructuredData),
        }}
      />

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <nav className="bg-white py-4 border-b" aria-label="Breadcrumb">
          <div className="max-w-6xl mx-auto px-6">
            <ol
              className="flex items-center text-sm"
              itemScope
              itemType="https://schema.org/BreadcrumbList"
            >
              <li
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <Link
                  href="/"
                  className="text-blue-700 hover:text-cyan-500 font-medium transition-colors"
                  itemProp="item"
                >
                  <span itemProp="name">خانه</span>
                </Link>
                <meta itemProp="position" content="1" />
              </li>
              <span className="text-blue-400 mx-2">/</span>
              <li
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <span
                  className="text-blue-500 font-medium"
                  itemProp="name"
                  aria-current="page"
                >
                  نمونه کارها
                </span>
                <meta itemProp="position" content="2" />
              </li>
            </ol>
          </div>
        </nav>

        <main>
          {/* Hero Section */}
          <header className="relative bg-gradient-to-l from-blue-600 to-purple-800 text-white py-20 overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="animate-wave absolute -top-10 -left-10 w-72 h-72 bg-white rounded-full"></div>
              <div
                className="animate-wave absolute -bottom-10 -right-10 w-96 h-96 bg-white rounded-full"
                style={{ animationDelay: '2s' }}
              ></div>
              <div
                className="animate-wave absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white rounded-full"
                style={{ animationDelay: '4s' }}
              ></div>
            </div>

            <div className="max-w-6xl mx-auto px-6">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h1 className="text-5xl font-bold mb-6 leading-tight text-center">
                    نمونه کارهای ما
                    <span
                      className="text-4xl ml-2"
                      role="img"
                      aria-label="ستاره"
                    >
                      ⭐
                    </span>
                  </h1>

                  <p className="text-xl text-blue-100 mb-6 leading-relaxed text-center">
                    مجموعه‌ای از پروژه‌های موفق که با{' '}
                    <strong>دقت، خلاقیت</strong> و استفاده از جدیدترین
                    تکنولوژی‌ها انجام شده‌اند.
                  </p>
                  <p className="text-xl text-blue-100 mb-6 leading-relaxed text-center">
                    هر پروژه، داستانی از موفقیت مشترک ما و مشتری ماست.
                  </p>

                  <div className="flex items-center mt-10 mr-20">
                    <Link
                      href="/contact"
                      className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold
               hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500
               hover:border-cyan-400 hover:scale-105 transition-all duration-300
               focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2"
                      aria-label="شروع پروژه جدید"
                    >
                      شروع پروژه جدید
                    </Link>
                  </div>
                </div>

                <div className="hidden md:block" aria-hidden="true">
                  <div className="relative flex justify-center">
                    <div className="w-80 h-80 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-9xl">
                      🚀
                    </div>
                    <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-green-400 rounded-full flex items-center justify-center text-2xl animate-pulse">
                      💎
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Portfolio Section */}
          <PortfolioSection />

          {/* CTA Section */}
          <section className="bg-gradient-to-l from-blue-600 to-purple-800 text-white py-16">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl font-bold mb-4">
                آماده شروع پروژه جدید هستید؟
                <span className="text-2xl ml-2" role="img" aria-label="راکت">
                  🚀
                </span>
              </h2>

              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                بیایید با هم پروژه رویایی‌تون را به واقعیت تبدیل کنیم!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 hover:text-white hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:ring-offset-2"
                  aria-label="تماس برای شروع پروژه جدید"
                >
                  شروع پروژه
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
