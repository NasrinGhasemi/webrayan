/**
 * کامپوننت Loading - نمایش حالت بارگذاری
 * این کامپوننت loading states مختلف رو مدیریت می‌کنه
 */

export default function Loading({
  size = 'medium',
  text = 'در حال بارگذاری...',
  type = 'spinner',
}) {
  // سایزهای مختلف
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  // نوع‌های مختلف لودینگ
  if (type === 'dots') {
    return (
      <div className="flex items-center justify-center space-x-2 space-x-reverse">
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: '0.1s' }}
        ></div>
        <div
          className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
          style={{ animationDelay: '0.2s' }}
        ></div>
        {text && <span className="mr-3 text-gray-600">{text}</span>}
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className="flex items-center justify-center">
        <div
          className={`${sizes[size]} bg-blue-500 rounded-full animate-pulse`}
        ></div>
        {text && <span className="mr-3 text-gray-600">{text}</span>}
      </div>
    );
  }

  // نوع پیش‌فرض: spinner
  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin`}
      ></div>
      {text && <span className="mr-3 text-gray-600">{text}</span>}
    </div>
  );
}

// کامپوننت Skeleton برای loading بهتر
export function Skeleton({ className = '', rows = 1 }) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 rounded h-4 mb-2 ${className}`}
          style={{ width: `${Math.random() * 40 + 60}%` }}
        ></div>
      ))}
    </div>
  );
}

// کامپوننت Card Skeleton
export function CardSkeleton() {
  return (
    <div className="animate-pulse p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        <div className="h-3 bg-gray-200 rounded w-4/6"></div>
      </div>
    </div>
  );
}
