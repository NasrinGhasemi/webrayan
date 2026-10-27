/**
 * Breadcrumb Schema Component
 * ایجاد Rich Snippet برای مسیر صفحه (Breadcrumb)
 */

export default function BreadcrumbSchema({ items }) {
  if (!items || items.length === 0) return null;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webrayandev.ir';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * نمونه استفاده:
 * 
 * const breadcrumbItems = [
 *   { name: 'خانه', url: '/' },
 *   { name: 'نمونه کارها', url: '/portfolio' },
 *   { name: 'فروشگاهی', url: '/portfolio/ecommerce' }
 * ];
 * 
 * <BreadcrumbSchema items={breadcrumbItems} />
 */

