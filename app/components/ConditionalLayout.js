"use client";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  
  // بررسی اینکه آیا در صفحات admin، dashboard یا auth هستیم
  const isAdminPage = pathname.startsWith("/admin");
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isAuthPage = pathname.startsWith("/auth");
  const hideHeaderFooter = isAdminPage || isDashboardPage || isAuthPage;

  if (hideHeaderFooter) {
    // صفحات بدون Header/Footer
    return (
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    );
  }

  // صفحات با Header/Footer
  return (
    <>
      <Header />
      <main id="main-content" className="pt-16" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}

