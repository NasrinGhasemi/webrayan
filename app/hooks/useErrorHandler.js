'use client';

import { useState, useCallback } from 'react';

/**
 * Hook سفارشی برای مدیریت خطاها
 * استفاده: const { error, loading, handleAsync } = useErrorHandler()
 */

export default function useErrorHandler() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // پاک کردن خطا
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // مدیریت عملیات async
  const handleAsync = useCallback(async asyncFunction => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      return result;
    } catch (err) {
      setError(err.message || 'خطای ناشناخته');
      console.error('خطا در handleAsync:', err);
      throw err; // خطا رو دوباره پرتاب می‌کنیم
    } finally {
      setLoading(false);
    }
  }, []);

  // نمایش toast notification برای خطا
  const showError = useCallback(message => {
    setError(message);
    // اینجا می‌تونیم toast library استفاده کنیم
    console.error('خطا:', message);
  }, []);

  return {
    error,
    loading,
    clearError,
    handleAsync,
    showError,
  };
}
