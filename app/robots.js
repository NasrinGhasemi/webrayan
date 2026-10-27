/**
 * Dynamic Robots.txt Generation برای Next.js 15
 * کنترل دسترسی موتورهای جستجو
 */

export default function robots() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://webrayandev.ir";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/dashboard/",
          "/api/",
          "/auth/",
          "/_next/",
          "/private/",
          "*.json",
          "/search",
        ],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "anthropic-ai",
        disallow: "/",
      },
      {
        userAgent: "Claude-Web",
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
