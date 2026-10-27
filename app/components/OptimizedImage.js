"use client";
import Image from "next/image";
import { useState } from "react";

/**
 * کامپوننت تصویر بهینه شده با قابلیت‌های پیشرفته
 * - Lazy loading خودکار
 * - Placeholder blur
 * - Error handling
 * - Multiple formats support
 * - Responsive sizes
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
  placeholder = "blur",
  blurDataURL,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  fallbackSrc = "/images/placeholder.jpg",
  quality = 85,
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const resolvedPlaceholder =
  placeholder === 'blur' && !blurDataURL ? 'empty' : placeholder;

  // تولید placeholder blur خودکار برای تصاویر محلی
  const generateBlurDataURL = (w = 10, h = 10) => {
    if (typeof Buffer === "undefined") {
      return `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjRjNGNEY2Ii8+Cjwvc3ZnPgo=`;
    }
    return `data:image/svg+xml;base64,${Buffer.from(
      `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <rect width="100%" height="100%" fill="url(#gradient)"/>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#e5e7eb;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#d1d5db;stop-opacity:1" />
          </linearGradient>
        </defs>
      </svg>`,
    ).toString("base64")}`;
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    console.warn(`تصویر بارگذاری نشد: ${src}`);
    setImgSrc(fallbackSrc);
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder={resolvedPlaceholder}
        blurDataURL={blurDataURL}
        sizes={sizes}
        quality={quality}
        onLoad={handleLoad}
        onError={handleError}
        className={`
    transition-all duration-300 ease-in-out
    ${isLoading ? "scale-110 blur-sm" : "scale-100 blur-0"}
    ${hasError ? "grayscale" : ""}
  `}
        {...props}
      />

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error overlay */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-gray-400 text-center">
            <svg
              className="w-8 h-8 mx-auto mb-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-xs">تصویر یافت نشد</p>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * کامپوننت تصویر آواتار بهینه شده
 */
export function OptimizedAvatar({
  src,
  alt,
  size = 40,
  className = "",
  fallbackInitials = "?",
  ...props
}) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative rounded-full overflow-hidden bg-gray-200 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {!hasError && src ? (
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="rounded-full object-cover"
          onError={() => setHasError(true)}
          {...props}
        />
      ) : (
        <span className="text-gray-500 font-medium text-sm">
          {fallbackInitials}
        </span>
      )}
    </div>
  );
}

/**
 * کامپوننت تصویر پس‌زمینه بهینه شده
 */
export function OptimizedBackgroundImage({
  src,
  alt,
  className = "",
  children,
  overlay = true,
  overlayColor = "bg-black/30",
  ...props
}) {
  return (
    <div className={`relative ${className}`}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="100vw"
        {...props}
      />
      {overlay && <div className={`absolute inset-0 ${overlayColor}`} />}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
}
