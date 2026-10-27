'use client';

/**
 * کامپوننت‌های Skeleton برای نمایش حالت Loading
 * بهبود تجربه کاربری در حین بارگذاری داده‌ها
 */

// Skeleton پایه
export function Skeleton({ className = '', width = 'w-full', height = 'h-4' }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${width} ${height} ${className}`}
      style={{
        animation: 'skeleton-loading 1.5s ease-in-out infinite',
      }}
    />
  );
}

// Skeleton برای کارت‌ها
export function CardSkeleton({ className = '' }) {
  return (
    <div
      className={`bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-lg ${className}`}
    >
      {/* Icon Skeleton */}
      <div className="flex justify-center mb-6">
        <Skeleton className="rounded-full" width="w-24" height="h-24" />
      </div>

      {/* Title Skeleton */}
      <Skeleton className="mx-auto mb-3" width="w-3/4" height="h-6" />

      {/* Description Skeleton */}
      <div className="space-y-2 mb-4">
        <Skeleton width="w-full" height="h-4" />
        <Skeleton width="w-5/6" height="h-4" />
        <Skeleton width="w-4/5" height="h-4" />
      </div>

      {/* Tags Skeleton */}
      <div className="flex justify-center gap-2">
        <Skeleton className="rounded-full" width="w-16" height="h-6" />
        <Skeleton className="rounded-full" width="w-20" height="h-6" />
      </div>
    </div>
  );
}

// Skeleton برای Portfolio Grid
export function PortfolioSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

// Skeleton برای Testimonials
export function TestimonialSkeleton() {
  return (
    <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 md:p-12 text-center shadow-lg">
      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <Skeleton className="rounded-full" width="w-16" height="h-16" />
      </div>

      {/* Rating */}
      <div className="flex justify-center gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="rounded" width="w-6" height="h-6" />
        ))}
      </div>

      {/* Text */}
      <div className="space-y-3 mb-8">
        <Skeleton width="w-full" height="h-4" />
        <Skeleton width="w-5/6" height="h-4" />
        <Skeleton width="w-4/5" height="h-4" />
        <Skeleton width="w-3/4" height="h-4" />
      </div>

      {/* Author Info */}
      <div className="border-t border-gray-200 pt-6 space-y-2">
        <Skeleton className="mx-auto" width="w-32" height="h-5" />
        <Skeleton className="mx-auto" width="w-24" height="h-4" />
        <Skeleton className="mx-auto" width="w-28" height="h-4" />
      </div>
    </div>
  );
}

// Skeleton برای Form Fields
export function FormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Name Field */}
      <div>
        <Skeleton width="w-16" height="h-4" className="mb-2" />
        <Skeleton width="w-full" height="h-12" className="rounded-lg" />
      </div>

      {/* Email Field */}
      <div>
        <Skeleton width="w-20" height="h-4" className="mb-2" />
        <Skeleton width="w-full" height="h-12" className="rounded-lg" />
      </div>

      {/* Message Field */}
      <div>
        <Skeleton width="w-24" height="h-4" className="mb-2" />
        <Skeleton width="w-full" height="h-32" className="rounded-lg" />
      </div>

      {/* Submit Button */}
      <Skeleton width="w-32" height="h-12" className="rounded-lg" />
    </div>
  );
}

// Skeleton برای Header/Navigation
export function HeaderSkeleton() {
  return (
    <div className="flex items-center justify-between p-4">
      {/* Logo */}
      <Skeleton width="w-32" height="h-8" />

      {/* Navigation */}
      <div className="hidden md:flex space-x-6">
        <Skeleton width="w-16" height="h-6" />
        <Skeleton width="w-20" height="h-6" />
        <Skeleton width="w-18" height="h-6" />
        <Skeleton width="w-22" height="h-6" />
      </div>

      {/* Auth Button */}
      <Skeleton width="w-24" height="h-10" className="rounded-lg" />
    </div>
  );
}

// Skeleton برای Stats
export function StatsSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white/60 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center shadow-lg"
        >
          {/* Icon */}
          <div className="flex justify-center mb-3">
            <Skeleton className="rounded" width="w-8" height="h-8" />
          </div>

          {/* Number */}
          <Skeleton className="mx-auto mb-2" width="w-16" height="h-8" />

          {/* Label */}
          <Skeleton className="mx-auto" width="w-20" height="h-4" />
        </div>
      ))}
    </div>
  );
}

// Skeleton برای Text Content
export function TextSkeleton({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 ? 'w-3/4' : 'w-full'}
          height="h-4"
        />
      ))}
    </div>
  );
}

// Skeleton برای Image Gallery
export function ImageGallerySkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          className="aspect-square rounded-lg"
          width="w-full"
          height="h-full"
        />
      ))}
    </div>
  );
}

// CSS برای انیمیشن Skeleton
export function SkeletonStyles() {
  return (
    <style jsx global>{`
      @keyframes skeleton-loading {
        0% {
          background-position: -200% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }

      .animate-skeleton {
        animation: skeleton-loading 1.5s ease-in-out infinite;
        background: linear-gradient(
          90deg,
          #f0f0f0 25%,
          #e0e0e0 50%,
          #f0f0f0 75%
        );
        background-size: 200% 100%;
      }
    `}</style>
  );
}
