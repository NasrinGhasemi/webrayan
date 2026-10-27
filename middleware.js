import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const SECRET = process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET;

export async function middleware(req) {
  const { pathname, search } = req.nextUrl;
  const isProd = process.env.NODE_ENV === "production";

  const needsAuth =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin") ||
    pathname.startsWith("/auth/login");

  let token = null;
  if (needsAuth) {
    try {
      token = await getToken({
        req,
        secret: SECRET,
        // نام کوکی و salt از این مشتق می‌شود؛ باید با پروتکل واقعی هماهنگ باشد
        // (روی http://localhost کوکی بدون پیشوند __Secure- ساخته می‌شود)
        secureCookie: req.nextUrl.protocol === "https:" ||
          req.headers.get("x-forwarded-proto") === "https",
      });
    } catch (err) {
      // هدر Authorization خراب (مثلاً Bearer بدفرم) نباید خطای کنترل‌نشده بدهد.
      // توکن نامعتبر = کاربر لاگین‌نکرده؛ به‌جای crash، ریدایرکت/401 انجام می‌شود.
      console.warn("[middleware] getToken failed:", err?.name || "error");
      token = null;
    }
  }

  const isLoggedIn = !!token;
  const isAdmin = token?.role === "admin";

  // ── API ادمین: پاسخ JSON، نه ریدایرکت ──
  if (pathname.startsWith("/api/admin") && !isAdmin) {
    return NextResponse.json(
      { success: false, error: isLoggedIn ? "Forbidden" : "Unauthorized" },
      { status: isLoggedIn ? 403 : 401 }
    );
  }

  // ── صفحات ادمین ──
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn) {
      const url = new URL("/auth/login", req.url);
      url.searchParams.set("callbackUrl", pathname + search);
      return NextResponse.redirect(url);
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/auth/unauthorized", req.url));
    }
  }

  // ── کاربر لاگین‌کرده در صفحه ورود ──
  if (pathname.startsWith("/auth/login") && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // ── هدرهای امنیتی + CSP nonce ──
  const nonce = crypto.randomUUID();
  // صفحات static در زمان build ساخته می‌شوند و nonce ندارند؛ فقط /admin (dynamic) nonce می‌گیرد.
  const useNonce = pathname.startsWith("/admin");
  const csp = buildCsp(nonce, isProd, useNonce);

  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-nonce", nonce);
  // مهم: Next.js نانس را از هدر «درخواست» می‌خواند تا به اسکریپت‌های خودش بزند
  requestHeaders.set("Content-Security-Policy", csp);

  const res = NextResponse.next({ request: { headers: requestHeaders } });
  res.headers.set("Content-Security-Policy", csp);
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  res.headers.set("Cross-Origin-Opener-Policy", "same-origin");

  if (isProd) {
    res.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }
  if (pathname.startsWith("/api")) {
    res.headers.set("Cache-Control", "no-store, must-revalidate");
  }

  return res;
}

function buildCsp(nonce, isProd, useNonce) {
  return [
    `default-src 'self'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `frame-ancestors 'none'`,
    `form-action 'self'`,
    useNonce
      ? `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isProd ? "" : " 'unsafe-eval'"}`
      : `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https:`,
    `font-src 'self' data:`,
    `connect-src 'self'${isProd ? "" : " ws: http://localhost:*"}`,
    `worker-src 'self' blob:`,
    isProd ? `upgrade-insecure-requests` : "",
  ]
    .filter(Boolean)
    .join("; ");
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|avif|svg|ico|woff2?)$).*)",
  ],
};
