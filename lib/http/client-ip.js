/**
 * آی‌پی کلاینت را فقط وقتی از x-forwarded-for می‌خوانیم که پروژه پشت پراکسی مورد اعتماد باشد.
 * TRUST_PROXY_HOPS = تعداد پراکسی‌های مورد اعتماد (مثلاً 1 برای Vercel/Nginx تنها).
 * پراکسی‌ها آی‌پی را به انتهای لیست اضافه می‌کنند؛ پس از راست می‌شماریم تا مقدار جعلی
 * که کلاینت در ابتدای هدر می‌فرستد نادیده گرفته شود.
 */
export function getClientIp(headers) {
  const hops = Number.parseInt(process.env.TRUST_PROXY_HOPS || "0", 10);
  if (hops > 0) {
    const parts = (headers.get("x-forwarded-for") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length) return parts[Math.max(0, parts.length - hops)];
  }
  return "unknown";
}
