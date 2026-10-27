'use client';
import { useState, useEffect, useRef, Suspense } from 'react';

/**
 * کامپوننت Lazy Loading هوشمند با Intersection Observer
 * برای بهینه‌سازی عملکرد صفحات طولانی
 */
export default function LazySection({
  children,
  fallback = null,
  rootMargin = '100px',
  threshold = 0.1,
  triggerOnce = true,
  className = '',
  ...props
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);

          if (triggerOnce) {
            observer.unobserve(ref.current);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    const element = ref.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [rootMargin, threshold, triggerOnce]);

  return (
    <div
      ref={ref}
      className={`transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      {...props}
    >
      {hasLoaded ? (
        <Suspense fallback={fallback}>{children}</Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}

/**
 * کامپوننت Skeleton Loading برای بهبود UX
 */
export function SkeletonLoader({
  lines = 3,
  height = 'h-4',
  className = '',
  animated = true,
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`
            ${height} bg-gray-200 rounded
            ${animated ? 'animate-pulse' : ''}
            ${i === lines - 1 ? 'w-3/4' : 'w-full'}
          `}
        />
      ))}
    </div>
  );
}

/**
 * کامپوننت Card Skeleton
 */
export function CardSkeleton({ className = '' }) {
  return (
    <div className={`bg-white rounded-lg border p-6 ${className}`}>
      <div className="animate-pulse">
        {/* Header */}
        <div className="flex items-center space-x-4 space-x-reverse mb-4">
          <div className="rounded-full bg-gray-200 h-10 w-10"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6">
          <div className="h-8 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook برای lazy loading با بهینه‌سازی
 */
export function useLazyLoad(options = {}) {
  const { rootMargin = '50px', threshold = 0.1, triggerOnce = true } = options;

  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const elementRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setIsLoaded(true);

          if (triggerOnce && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { rootMargin, threshold }
    );

    const element = elementRef.current;
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [rootMargin, threshold, triggerOnce]);

  return {
    ref: elementRef,
    isVisible,
    isLoaded,
  };
}
