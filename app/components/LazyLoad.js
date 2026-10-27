'use client';

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import OptimizedImage from './OptimizedImage';
import { Skeleton } from './LoadingSkeleton';


const EMPTY_DEPENDENCIES = Object.freeze([]);

const supportsIntersectionObserver =
  typeof window !== 'undefined' && 'IntersectionObserver' in window;

function createObserver(node, callback, options) {
  if (!node || !supportsIntersectionObserver) {
    return null;
  }

  const observer = new IntersectionObserver(callback, options);
  observer.observe(node);

  return observer;
}

/**
 * Lazy loading عمومی با Intersection Observer
 */
export function LazyLoad({
  children,
  fallback = <Skeleton />,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
  once = true,
}) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const node = elementRef.current;

    if (!node) {
      return undefined;
    }

    if (!supportsIntersectionObserver) {
      setIsVisible(true);
      setHasLoaded(true);
      return undefined;
    }

    const observer = createObserver(
      node,
      ([entry]) => {
        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
          setIsVisible(true);
          setHasLoaded(true);

          if (once) {
            observer?.unobserve(entry.target);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    return () => {
      observer?.disconnect();
    };
  }, [threshold, rootMargin, once]);

  const shouldRender = once ? hasLoaded || isVisible : isVisible;

  return (
    <div ref={elementRef} className={className}>
      {shouldRender ? children : fallback}
    </div>
  );
}

/**
 * HOC برای Lazy Loading کامپوننت‌ها
 */
export function withLazyLoading(Component, fallback = <Skeleton />) {
  function LazyComponent(props) {
    return (
      <Suspense fallback={fallback}>
        <LazyLoad fallback={fallback}>
          <Component {...props} />
        </LazyLoad>
      </Suspense>
    );
  }

  LazyComponent.displayName = `withLazyLoading(${
    Component.displayName || Component.name || 'Component'
  })`;

  return LazyComponent;
}

/**
 * Lazy loading تصویر با استفاده از OptimizedImage
 */
export function LazyImage({
  src,
  alt,
  className = '',
  width,
  height,
  onLoad,
  ...props
}) {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = elementRef.current;

    if (!node) {
      return undefined;
    }

    if (!supportsIntersectionObserver) {
      setIsVisible(true);
      return undefined;
    }

    const observer = createObserver(
      node,
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer?.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );

    return () => {
      observer?.disconnect();
    };
  }, []);

  const handleLoad = useCallback(() => {
    onLoad?.();
  }, [onLoad]);

  return (
    <div
      ref={elementRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {isVisible && (
        <OptimizedImage
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="h-full w-full object-cover"
          onLoad={handleLoad}
          {...props}
        />
      )}
    </div>
  );
}

/**
 * Lazy loading محتوای متنی
 */
export function LazyContent({
  children,
  delay = 0,
  className = '',
  animationType = 'fade',
}) {
  const elementRef = useRef(null);
  const timeoutRef = useRef(null);

  const [isVisible, setIsVisible] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const node = elementRef.current;

    if (!node) {
      return undefined;
    }

    const startAnimation = () => {
      setIsVisible(true);

      timeoutRef.current = window.setTimeout(() => {
        setShouldAnimate(true);
      }, delay);
    };

    if (!supportsIntersectionObserver) {
      startAnimation();

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }

    const observer = createObserver(
      node,
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        startAnimation();
        observer?.unobserve(entry.target);
      },
      { threshold: 0.1 }
    );

    return () => {
      observer?.disconnect();

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay]);

  const animationClass = useMemo(() => {
    const baseClass = 'transition-all duration-700 ease-out';

    switch (animationType) {
      case 'slideUp':
        return `${baseClass} ${
          shouldAnimate ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`;

      case 'slideDown':
        return `${baseClass} ${
          shouldAnimate
            ? 'translate-y-0 opacity-100'
            : '-translate-y-8 opacity-0'
        }`;

      case 'slideLeft':
        return `${baseClass} ${
          shouldAnimate ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
        }`;

      case 'slideRight':
        return `${baseClass} ${
          shouldAnimate
            ? 'translate-x-0 opacity-100'
            : '-translate-x-8 opacity-0'
        }`;

      case 'scale':
        return `${baseClass} ${
          shouldAnimate ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`;

      case 'fade':
      default:
        return `${baseClass} ${
          shouldAnimate ? 'opacity-100' : 'opacity-0'
        }`;
    }
  }, [animationType, shouldAnimate]);

  return (
    <div ref={elementRef} className={`${animationClass} ${className}`}>
      {isVisible ? children : null}
    </div>
  );
}

/**
 * Virtualized list
 */
export function LazyList({
  items,
  renderItem,
  itemHeight = 100,
  containerHeight = 400,
  overscan = 5,
  className = '',
}) {
  const [scrollTop, setScrollTop] = useState(0);

  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - overscan
  );

  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex]
  );

  const handleScroll = useCallback((event) => {
    setScrollTop(event.currentTarget.scrollTop);
  }, []);

  return (
    <div
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div
        style={{
          position: 'relative',
          height: items.length * itemHeight,
        }}
      >
        {visibleItems.map((item, index) => {
          const itemIndex = startIndex + index;

          return (
            <div
              key={itemIndex}
              style={{
                position: 'absolute',
                top: itemIndex * itemHeight,
                width: '100%',
                height: itemHeight,
              }}
            >
              {renderItem(item, itemIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Hook برای Intersection Observer
 */
export function useIntersectionObserver(
  elementRef,
  {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  } = {}
) {
  const [entry, setEntry] = useState(null);

  const frozen = Boolean(entry?.isIntersecting && freezeOnceVisible);

  const updateEntry = useCallback(([nextEntry]) => {
    setEntry(nextEntry ?? null);
  }, []);

  useEffect(() => {
    const node = elementRef?.current;

    if (!node || !supportsIntersectionObserver || frozen) {
      return undefined;
    }

    const observer = new IntersectionObserver(updateEntry, {
      threshold,
      root,
      rootMargin,
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [
    elementRef,
    threshold,
    root,
    rootMargin,
    frozen,
    updateEntry,
  ]);

  return entry;
}

/**
 * Hook برای دریافت Lazy داده‌ها
 *
 * dependencies باید از سمت مصرف‌کننده به‌صورت آرایه‌ای پایدار ارسال شود.
 * مثال:
 *
 * const dependencies = useMemo(() => [projectId], [projectId]);
 * const result = useLazyData(fetchData, dependencies);
 */
export function useLazyData(
  fetchFunction,
  dependencies = EMPTY_DEPENDENCIES
) {
  const elementRef = useRef(null);
  const stableDependencies = Array.isArray(dependencies)
    ? dependencies
    : EMPTY_DEPENDENCIES;

  const [isVisible, setIsVisible] = useState(
    !supportsIntersectionObserver
  );
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const node = elementRef.current;

    if (!node || isVisible) {
      return undefined;
    }

    if (!supportsIntersectionObserver) {
      setIsVisible(true);
      return undefined;
    }

    const observer = createObserver(
      node,
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer?.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    return () => {
      observer?.disconnect();
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || typeof fetchFunction !== 'function') {
      return undefined;
    }

    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchFunction();

        if (!cancelled) {
          setData(result);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(fetchError);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, [isVisible, fetchFunction, stableDependencies]);

  return {
    data,
    loading,
    error,
    ref: elementRef,
  };
}
