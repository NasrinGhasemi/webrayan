/**
 * FAQ Schema Component
 * ایجاد Rich Snippet برای صفحه FAQ
 */

export default function FAQSchema({ faqs }) {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
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

/**
 * نمونه استفاده:
 * 
 * const faqs = [
 *   {
 *     question: 'چگونه می‌توانم سفارش دهم؟',
 *     answer: 'از طریق فرم تماس یا شماره تلفن با ما در ارتباط باشید.'
 *   },
 *   {
 *     question: 'مدت زمان تحویل چقدر است؟',
 *     answer: 'معمولاً 2 تا 4 هفته بسته به پیچیدگی پروژه.'
 *   }
 * ];
 * 
 * <FAQSchema faqs={faqs} />
 */

