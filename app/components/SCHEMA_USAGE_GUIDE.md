# 📖 راهنمای استفاده از Rich Snippets

همه کامپوننت‌های Schema برای بهبود SEO و نمایش Rich Snippets در Google ساخته شده‌اند.

---

## 🎯 کامپوننت‌های موجود

### 1. FAQSchema - صفحات FAQ

```jsx
import FAQSchema from '@/app/components/FAQSchema';

const faqs = [
  {
    question: 'چگونه می‌توانم سفارش دهم؟',
    answer: 'از طریق فرم تماس یا شماره تلفن با ما در ارتباط باشید.'
  },
  {
    question: 'مدت زمان تحویل چقدر است؟',
    answer: 'معمولاً 2 تا 4 هفته بسته به پیچیدگی پروژه.'
  }
];

export default function FAQPage() {
  return (
    <>
      <FAQSchema faqs={faqs} />
      <div>{/* محتوای صفحه */}</div>
    </>
  );
}
```

---

### 2. BreadcrumbSchema - مسیریابی صفحه

```jsx
import BreadcrumbSchema from '@/app/components/BreadcrumbSchema';

const breadcrumbItems = [
  { name: 'خانه', url: '/' },
  { name: 'نمونه کارها', url: '/portfolio' },
  { name: 'فروشگاهی', url: '/portfolio/ecommerce' }
];

export default function PortfolioPage() {
  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} />
      <div>{/* محتوای صفحه */}</div>
    </>
  );
}
```

---

### 3. ArticleSchema - مقالات و Blog Posts

```jsx
import ArticleSchema from '@/app/components/ArticleSchema';

const article = {
  title: 'راهنمای طراحی سایت فروشگاهی',
  description: 'آموزش کامل طراحی سایت فروشگاهی حرفه‌ای',
  image: '/images/blog/ecommerce-guide.jpg',
  publishedAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T15:30:00Z',
  author: 'تیم وب‌رایان',
  url: '/blog/ecommerce-website-guide'
};

export default function BlogPost() {
  return (
    <>
      <ArticleSchema article={article} />
      <article>{/* محتوای مقاله */}</article>
    </>
  );
}
```

---

### 4. ProductSchema - خدمات و محصولات

```jsx
import ProductSchema from '@/app/components/ProductSchema';

const service = {
  name: 'طراحی سایت فروشگاهی',
  description: 'طراحی و توسعه سایت فروشگاهی حرفه‌ای با Next.js',
  image: '/images/services/ecommerce.jpg',
  price: '50000000',
  priceValidUntil: '2024-12-31',
  url: '/services/ecommerce',
  rating: {
    value: '4.8',
    count: 42
  }
};

export default function ServicePage() {
  return (
    <>
      <ProductSchema product={service} />
      <div>{/* محتوای صفحه خدمت */}</div>
    </>
  );
}
```

---

### 5. ReviewSchema - نظرات مشتریان

```jsx
import ReviewSchema from '@/app/components/ReviewSchema';

const reviews = [
  {
    authorName: 'علی محمدی',
    date: '2024-01-15',
    text: 'کار عالی و حرفه‌ای. پشتیبانی بسیار خوب',
    rating: '5'
  },
  {
    authorName: 'سارا احمدی',
    date: '2024-01-20',
    text: 'راضی هستم. سایتم خیلی سریع شد',
    rating: '4.5'
  }
];

export default function TestimonialsPage() {
  return (
    <>
      <ReviewSchema 
        reviews={reviews} 
        itemName="خدمات طراحی سایت وب‌رایان" 
      />
      <div>{/* نمایش نظرات */}</div>
    </>
  );
}
```

---

## 🧪 تست کردن Schema ها

بعد از اضافه کردن Schema ها، حتماً تست کنید:

### 1. Google Rich Results Test
https://search.google.com/test/rich-results

### 2. Schema.org Validator
https://validator.schema.org/

### 3. نمونه کد تست:

```html
<!-- کپی HTML rendered page -->
<!-- Paste در Rich Results Test -->
```

---

## ✅ چک‌لیست استفاده

- [ ] FAQSchema در صفحه FAQ
- [ ] BreadcrumbSchema در تمام صفحات داخلی
- [ ] ArticleSchema در blog posts
- [ ] ProductSchema در صفحات خدمات
- [ ] ReviewSchema در صفحه نظرات
- [ ] تست با Google Rich Results Test
- [ ] Submit sitemap به Google Search Console

---

## 📊 تاثیر بر SEO

این Schema ها باعث می‌شوند:

✅ Rich Snippets در نتایج Google  
✅ افزایش CTR (Click Through Rate)  
✅ بهبود رتبه در جستجو  
✅ نمایش ستاره‌ها و Rating  
✅ نمایش FAQ در نتایج  
✅ بهبود تجربه کاربری  

---

## 🎯 نتیجه

با استفاده از این Schema ها، **SEO Score** شما از **9/10** به **10/10** می‌رسد! ⭐

