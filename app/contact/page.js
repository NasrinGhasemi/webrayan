import ContactPageClient from './ContactPageClient';

// Metadata برای SEO
export const metadata = {
  title: 'ارتباط با من - وب‌رایان | تماس و مشاوره رایگان',
  description:
    'با من در ارتباط باشید! مشاوره رایگان، پاسخ در 2 ساعت، پشتیبانی 6 ماهه. فرم تماس، شماره تلفن و آدرس دفتر.',
  keywords:
    'تماس وب‌رایان, مشاوره رایگان, طراحی سایت, تماس طراح سایت, Ngh developer',

  openGraph: {
    title: 'ارتباط با من - وب‌رایان',
    description:
      'مشاوره رایگان و پاسخ سریع! بیایید پروژه رؤیایی‌تون را با هم بسازیم',
    url: 'https://webrayandev.ir/contact',
    siteName: 'وب‌رایان',
    images: [
      {
        url: 'https://webrayandev.ir/images/contact-og.jpg',
        width: 1200,
        height: 630,
        alt: 'ارتباط با من - وب‌رایان',
      },
    ],
    locale: 'fa_IR',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'ارتباط با من - وب‌رایان',
    description: 'مشاوره رایگان و پاسخ سریع برای پروژه‌های وب',
    images: ['https://webrayandev.ir/images/contact-twitter.jpg'],
  },

  alternates: {
    canonical: 'https://webrayandev.ir/contact',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Server Component wrapper
const ContactPage = () => {
  return <ContactPageClient />;
};

export default ContactPage;
