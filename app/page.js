// app/page.js
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import ServicesPreview from "./components/ServicesPreview";

export const metadata = {
  title: "وب‌رایان | طراحی سایت حرفه‌ای برای کسب‌وکارهای مدرن",
  description:
    "وب‌رایان با طراحی وب‌سایت‌های سریع، امن و ریسپانسیو به رشد دیجیتال کسب‌وکار شما کمک می‌کند.",
  keywords: [
    "طراحی سایت",
    "طراحی وب‌سایت حرفه‌ای",
    "وب‌رایان",
    "سایت شرکتی",
    "سایت شخصی",
    "طراحی پنل ادمین",
    "توسعه فرانت‌اند",
    "Next.js",
  ],
  authors: [{ name: "WebRayan" }],
  creator: "WebRayan",
  publisher: "WebRayan",
  openGraph: {
    title: "وب‌رایان | طراحی سایت حرفه‌ای برای کسب‌وکارهای مدرن",
    description:
      "طراحی وب‌سایت‌های سریع، امن و ریسپانسیو برای رشد برند و افزایش اعتماد مشتری.",
    url: "https://webrayandev.ir",
    siteName: "وب‌رایان",
    type: "website",
    locale: "fa_IR",
  },
};

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "وب‌رایان",
    url: "https://webrayandev.ir",
    description:
      "طراحی وب‌سایت‌های حرفه‌ای، سریع و ریسپانسیو برای کسب‌وکارها",
    publisher: {
      "@type": "Person",
      name: "WebRayan",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main>
        <HeroSection />
        <StatsSection />
        <ServicesPreview />
      </main>
    </>
  );
}
