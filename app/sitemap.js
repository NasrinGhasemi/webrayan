/**
 * Dynamic Sitemap Generation برای Next.js 15
 * بهینه‌سازی SEO با sitemap خودکار
 */

export default function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://webrayandev.ir";
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/portfolio`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Service pages
  const servicePages = [
    "website-design",
    "ecommerce-development",
    "mobile-app-development",
    "seo-optimization",
    "ui-ux-design",
    "wordpress-development",
  ].map((service) => ({
    url: `${baseUrl}/services/${service}`,
    lastModified: currentDate,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Portfolio categories
  const portfolioCategories = [
    "ecommerce",
    "personal",
    "restaurant",
    "education",
    "news",
    "corporate",
  ].map((category) => ({
    url: `${baseUrl}/portfolio/${category}`,
    lastModified: currentDate,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticPages, ...servicePages, ...portfolioCategories];
}

/**
 * Generate dynamic sitemap for blog posts
 * This would be called if you have a blog
 */
export async function generateBlogSitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://webrayandev.ir";

  try {
    // Fetch blog posts from your API or database
    // const posts = await fetch(`${baseUrl}/api/blog`).then(res => res.json());

    // For now, return empty array since we don't have blog posts yet
    const posts = [];

    return posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.createdAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Error generating blog sitemap:", error);
    return [];
  }
}

/**
 * Generate dynamic sitemap for portfolio projects
 */
export async function generatePortfolioSitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://webrayandev.ir";

  try {
    // Fetch portfolio projects from API
    const response = await fetch(`${baseUrl}/api/portfolio?published=true`);
    const data = await response.json();
    const projects = data.projects || [];

    return projects.map((project) => ({
      url: `${baseUrl}/portfolio/project/${project.id}`,
      lastModified: project.updatedAt || project.createdAt,
      changeFrequency: "monthly",
      priority: 0.5,
    }));
  } catch (error) {
    console.error("Error generating portfolio sitemap:", error);
    return [];
  }
}
