// تنظیم هدرهای امنیتی برای محافظت از وب‌سایت

export function getCSPHeader() {
  const cspDirectives = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'unsafe-inline'", // Required for Next.js
      "'unsafe-eval'", // Required for development
      'https://vercel.live',
      'https://www.googletagmanager.com',
      'https://www.google-analytics.com',
      'https://accounts.google.com',
      'https://apis.google.com',
    ],

    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https://*.vercel.app',
      'https://webrayan.com',
      'https://avatars.githubusercontent.com',
      'https://lh3.googleusercontent.com',
    ],
    'connect-src': [
      "'self'",
      'https://api.github.com',
      'https://accounts.google.com',
      'https://oauth2.googleapis.com',
      'https://www.google-analytics.com',
      'https://vitals.vercel-analytics.com',
    ],
    'frame-src': ['https://accounts.google.com', 'https://github.com'],
    'media-src': ["'self'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'none'"],
    'upgrade-insecure-requests': [],
  };

  // Convert directives to string
  const cspString = Object.entries(cspDirectives)
    .map(([directive, sources]) => {
      if (sources.length === 0) return directive;
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');

  return cspString;
}

/**
 * Security Headers Configuration
 */
export function getSecurityHeaders() {
  return {
    // Content Security Policy
    'Content-Security-Policy': getCSPHeader(),

    // Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // XSS Protection
    'X-XSS-Protection': '1; mode=block',

    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // HSTS (HTTP Strict Transport Security)
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',

    // Permissions Policy
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()',
      'payment=()',
      'usb=()',
      'bluetooth=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
    ].join(', '),

    // Cross-Origin Policies
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Resource-Policy': 'cross-origin',

    // Server Information
    Server: 'webrayan-server',
    'X-Powered-By': '', // Remove X-Powered-By header

    // Cache Control for sensitive pages
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  };
}

/**
 * API Security Headers
 */
export function getAPISecurityHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'no-referrer',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    'Access-Control-Allow-Origin':
      process.env.NODE_ENV === 'production' ? 'https://webrayan.com' : '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
    'Access-Control-Max-Age': '86400',
  };
}

/**
 * CORS Configuration
 */
export function getCORSConfig() {
  const allowedOrigins = [
    'https://webrayan.com',
    'https://www.webrayan.com',
    ...(process.env.NODE_ENV === 'development'
      ? ['http://localhost:3000', 'http://127.0.0.1:3000']
      : []),
  ];

  return {
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-CSRF-Token',
      'X-Requested-With',
    ],
    maxAge: 86400, // 24 hours
  };
}

/**
 * Apply Security Headers to Response
 */
export function applySecurityHeaders(response, type = 'page') {
  const headers =
    type === 'api' ? getAPISecurityHeaders() : getSecurityHeaders();

  Object.entries(headers).forEach(([key, value]) => {
    if (value) {
      response.headers.set(key, value);
    }
  });

  return response;
}

/**
 * Security Headers Middleware
 */
export function securityHeadersMiddleware(request) {
  const response = new Response();

  // Apply appropriate headers based on request type
  const isAPI = request.url.includes('/api/');
  applySecurityHeaders(response, isAPI ? 'api' : 'page');

  return {
    headers: Object.fromEntries(response.headers.entries()),
  };
}

/**
 * Rate Limiting Headers
 */
export function addRateLimitHeaders(response, rateLimitInfo) {
  const { limit, remaining, resetTime, retryAfter } = rateLimitInfo;

  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', resetTime.toString());

  if (remaining === 0 && retryAfter) {
    response.headers.set('Retry-After', retryAfter.toString());
  }

  return response;
}

/**
 * Security Audit Headers
 */
export function getSecurityAuditHeaders() {
  return {
    // Security reporting
    'Report-To': JSON.stringify({
      group: 'csp-endpoint',
      max_age: 10886400,
      endpoints: [{ url: 'https://webrayan.com/api/csp-report' }],
    }),

    // Network Error Logging
    NEL: JSON.stringify({
      report_to: 'csp-endpoint',
      max_age: 2592000,
      include_subdomains: true,
    }),

    // Expect-CT (Certificate Transparency)
    'Expect-CT':
      'max-age=86400, enforce, report-uri="https://webrayan.com/api/ct-report"',
  };
}

/**
 * Development Security Headers (Relaxed)
 */
export function getDevelopmentSecurityHeaders() {
  return {
    'Content-Security-Policy':
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' *; img-src 'self' data: blob: *;",
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer-when-downgrade',
  };
}

/**
 * Check if request needs security headers
 */
export function shouldApplySecurityHeaders(pathname) {
  const excludePaths = [
    '/_next/',
    '/api/auth/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
  ];

  return !excludePaths.some(path => pathname.startsWith(path));
}

/**
 * Content Type Security
 */
export function getSecureContentType(fileExtension) {
  const contentTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml; charset=utf-8',
    '.pdf': 'application/pdf',
    '.txt': 'text/plain; charset=utf-8',
  };

  return contentTypes[fileExtension] || 'application/octet-stream';
}
