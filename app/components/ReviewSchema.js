/**
 * Review Schema Component
 * برای نمایش نظرات مشتریان
 */

export default function ReviewSchema({ reviews, itemName }) {
  if (!reviews || reviews.length === 0) return null;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webrayandev.ir';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: itemName || 'خدمات وب‌رایان',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: calculateAverageRating(reviews),
      reviewCount: reviews.length,
      bestRating: '5',
      worstRating: '1',
    },
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.authorName,
      },
      datePublished: review.date,
      reviewBody: review.text,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: '5',
        worstRating: '1',
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function calculateAverageRating(reviews) {
  if (!reviews || reviews.length === 0) return '0';
  
  const sum = reviews.reduce((acc, review) => acc + parseFloat(review.rating), 0);
  const average = sum / reviews.length;
  
  return average.toFixed(1);
}

/**
 * نمونه استفاده:
 * 
 * const reviews = [
 *   {
 *     authorName: 'علی محمدی',
 *     date: '2024-01-15',
 *     text: 'کار عالی و حرفه‌ای. پشتیبانی بسیار خوب',
 *     rating: '5'
 *   },
 *   {
 *     authorName: 'سارا احمدی',
 *     date: '2024-01-20',
 *     text: 'راضی هستم. سایتم خیلی سریع شد',
 *     rating: '4.5'
 *   }
 * ];
 * 
 * <ReviewSchema reviews={reviews} itemName="طراحی سایت فروشگاهی" />
 */

