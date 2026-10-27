/**
 * Article Schema Component
 * برای blog posts و مقالات
 */

export default function ArticleSchema({ article }) {
  if (!article) return null;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webrayandev.ir';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description || article.excerpt,
    image: article.image ? `${baseUrl}${article.image}` : `${baseUrl}/images/og-image.jpg`,
    datePublished: article.publishedAt || article.createdAt,
    dateModified: article.updatedAt || article.publishedAt || article.createdAt,
    author: {
      '@type': article.authorType || 'Organization',
      name: article.author || 'وب‌رایان',
      url: article.authorUrl || baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'وب‌رایان',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}${article.url}`,
    },
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
 * const article = {
 *   title: 'راهنمای طراحی سایت فروشگاهی',
 *   description: 'آموزش کامل طراحی سایت فروشگاهی حرفه‌ای',
 *   image: '/images/blog/ecommerce-guide.jpg',
 *   publishedAt: '2024-01-15T10:00:00Z',
 *   updatedAt: '2024-01-20T15:30:00Z',
 *   author: 'تیم وب‌رایان',
 *   url: '/blog/ecommerce-website-guide'
 * };
 * 
 * <ArticleSchema article={article} />
 */

