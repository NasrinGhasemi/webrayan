'use client';

import React from 'react';

/**
 * Error Boundary برای مدیریت خطاهای React
 * بهبود تجربه کاربری در مواقع خطا
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Send error to monitoring service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
      });
    }

    // You can also log the error to an error reporting service here
    // Example: Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom error UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.handleReset}
          {...this.props}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Error Fallback Component
 */
function ErrorFallback({
  error,
  errorInfo,
  onReset,
  title = 'مشکلی پیش آمده است',
  message = 'متأسفانه خطایی در بارگذاری این بخش رخ داده است. لطفاً دوباره تلاش کنید.',
  showDetails = false,
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-white/20">
        {/* Error Icon */}
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>

        {/* Error Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>

        {/* Error Message */}
        <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onReset}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            تلاش مجدد
          </button>

          <button
            onClick={() => (window.location.href = '/')}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            بازگشت به خانه
          </button>
        </div>

        {/* Error Details (Development Mode) */}
        {showDetails && error && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              جزئیات خطا (حالت توسعه)
            </summary>
            <div className="mt-2 p-4 bg-gray-100 rounded-lg text-xs font-mono text-gray-800 overflow-auto max-h-40">
              <div className="mb-2">
                <strong>Error:</strong> {error.toString()}
              </div>
              {errorInfo && (
                <div>
                  <strong>Stack Trace:</strong>
                  <pre className="whitespace-pre-wrap">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* Contact Support */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">
            اگر مشکل ادامه دارد، با پشتیبانی تماس بگیرید:
          </p>
          <a
            href="/contact"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors duration-200"
          >
            تماس با پشتیبانی
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Simple Error Boundary برای کامپوننت‌های کوچک
 */
export function SimpleErrorBoundary({
  children,
  fallback = (
    <div className="p-4 text-center text-gray-500">خطا در بارگذاری</div>
  ),
}) {
  return <ErrorBoundary fallback={fallback}>{children}</ErrorBoundary>;
}

/**
 * Async Error Boundary برای کامپوننت‌های async
 */
export function AsyncErrorBoundary({ children, fallback }) {
  return (
    <ErrorBoundary>
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center p-8">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        }
      >
        {children}
      </React.Suspense>
    </ErrorBoundary>
  );
}

/**
 * Hook برای مدیریت خطاها در کامپوننت‌های function
 */
export function useErrorHandler() {
  const [error, setError] = React.useState(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback(error => {
    console.error('Error captured:', error);
    setError(error);

    // Send to monitoring service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
      });
    }
  }, []);

  // Throw error to be caught by Error Boundary
  if (error) {
    throw error;
  }

  return { captureError, resetError };
}

/**
 * HOC برای wrap کردن کامپوننت‌ها با Error Boundary
 */
export function withErrorBoundary(Component, errorFallback) {
  const WrappedComponent = props => {
    return (
      <ErrorBoundary fallback={errorFallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

export default ErrorBoundary;
