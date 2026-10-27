/**
 * Product Schema Component
 * برای نمایش خدمات به عنوان محصول
 */

export default function ProductSchema({ product }) {
  if (!product) return null;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webrayandev.ir';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image ? `${baseUrl}${product.image}` : `${baseUrl}/images/og-image.jpg`,
    brand: {
      '@type': 'Brand',
      name: 'وب‌رایان',
    },
    offers: {
      '@type': 'Offer',
      url: `${baseUrl}${product.url}`,
      priceCurrency: 'IRR',
      price: product.price || '0',
      priceValidUntil: product.priceValidUntil,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'وب‌رایان',
      },
    },
  };

  // اضافه کردن rating اگر وجود دارد
  if (product.rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating.value,
      reviewCount: product.rating.count,
      bestRating: '5',
      worstRating: '1',
    };
  }

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
 * const service = {
 *   name: 'طراحی سایت فروشگاهی',
 *   description: 'طراحی و توسعه سایت فروشگاهی حرفه‌ای با Next.js',
 *   image: '/images/services/ecommerce.jpg',
 *   price: '50000000',
 *   priceValidUntil: '2024-12-31',
 *   url: '/services/ecommerce',
 *   rating: {
 *     value: '4.8',
 *     count: 42
 *   }
 * };
 * 
 * <ProductSchema product={service} />
 */

