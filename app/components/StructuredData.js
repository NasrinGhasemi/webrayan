/**
 * کامپوننت Structured Data برای بهبود SEO
 * این کامپوننت به موتورهای جستجو کمک می‌کنه بهتر سایت رو بفهمن
 */

export default function StructuredData({ type = 'Organization', data = {} }) {
  // اطلاعات پایه شرکت
  const baseOrganizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'وب‌رایان',
    url: 'https://webrayandev.ir',
    logo: 'https://webrayandev.ir/images/logo.png',
    sameAs: [
      'https://linkedin.com/company/webrayandev',
      'https://instagram.com/webrayandev.ir',
      'https://t.me/webrayandev',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+98-916-653-0931',
      contactType: 'Customer Service',
      areaServed: 'IR',
      availableLanguage: ['Persian', 'English'],
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IR',
      addressLocality: 'تهران',
      postalCode: '1234567890',
    },
    foundingDate: '2020',
    description:
      'شرکت وب‌رایان ارائه‌دهنده خدمات طراحی و توسعه وب‌سایت، فروشگاه اینترنتی و اپلیکیشن‌های وب',
    keywords: 'طراحی سایت، توسعه وب، فروشگاه اینترنتی، React، Next.js',
  };

  // اطلاعات وب‌سایت
  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'وب‌رایان',
    url: 'https://webrayandev.ir',
    description: 'طراحی و توسعه سایت حرفه‌ای، فروشگاه اینترنتی، اپلیکیشن وب',
    inLanguage: 'fa-IR',
    publisher: {
      '@type': 'Organization',
      name: 'وب‌رایان',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://webrayandev.ir/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  // اطلاعات خدمات محلی
  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'وب‌رایان',
    image: 'https://webrayandev.ir/images/logo.png',
    telephone: '+98-916-653-0931',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'خوزستان، ایران',
      addressLocality: 'بندرماهشهر',
      addressCountry: 'IR',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '14:00',
      },
    ],
    priceRange: '$$',
    currenciesAccepted: 'IRR',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer',
  };

  // انتخاب نوع داده بر اساس type
  let structuredData;
  switch (type) {
    case 'Website':
      structuredData = { ...websiteData, ...data };
      break;
    case 'LocalBusiness':
      structuredData = { ...localBusinessData, ...data };
      break;
    case 'Organization':
    default:
      structuredData = { ...baseOrganizationData, ...data };
      break;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
}
