'use client';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  icon,
  disabled = false,
  loading = false,
  className = '',
  ...props 
}) {
  // از کلاس‌های موجود در buttons.css استفاده می‌کنیم
  const getButtonClass = () => {
    let baseClass = '';
    
    // Variant Classes (از buttons.css)
    switch (variant) {
      case 'primary':
        baseClass = size === 'sm' 
          ? 'btn-primary-sm' 
          : size === 'xs' 
          ? 'btn-primary-xs' 
          : 'btn-primary';
        break;
      case 'secondary':
        baseClass = size === 'sm' 
          ? 'btn-secondary-sm' 
          : size === 'xs' 
          ? 'btn-secondary-xs' 
          : 'btn-secondary';
        break;
      case 'secondary-dark':
        baseClass = size === 'sm' 
          ? 'btn-secondary-dark-sm' 
          : 'btn-secondary-dark';
        break;
      case 'success':
        baseClass = 'btn-success';
        break;
      case 'danger':
        baseClass = 'btn-danger';
        break;
      case 'icon':
        baseClass = 'btn-icon';
        break;
      case 'outline':
        baseClass = 'border-2 border-blue-600 text-blue-600 bg-white hover:bg-blue-50';
        if (size === 'sm') baseClass += ' px-3 py-1.5 text-sm';
        else if (size === 'xs') baseClass += ' px-2 py-1 text-xs';
        else baseClass += ' px-4 py-2 text-base';
        break;
      case 'ghost':
        baseClass = 'text-gray-700 hover:bg-gray-100';
        if (size === 'sm') baseClass += ' px-3 py-1.5 text-sm';
        else if (size === 'xs') baseClass += ' px-2 py-1 text-xs';
        else baseClass += ' px-4 py-2 text-base';
        break;
      default:
        baseClass = 'btn-primary';
    }
    
    return baseClass;
  };

  return (
    <button
      disabled={disabled || loading}
      className={`
        ${getButtonClass()}
        inline-flex items-center justify-center gap-2
        rounded-lg font-semibold
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        ${loading ? 'btn-loading' : ''}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin h-4 w-4" 
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {icon && !loading && icon}
      {children}
    </button>
  );
}
