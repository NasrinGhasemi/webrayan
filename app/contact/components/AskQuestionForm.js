'use client';
import { useState, useCallback, useEffect } from 'react';

const AskQuestionForm = ({ isOpen = false, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    question: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(''); // '', success, error, failed

  // Reset form when modal is closed
  useEffect(() => {
    if (!isOpen) {
      // Reset all states when modal closes
      setFormData({ name: '', email: '', question: '' });
      setErrors({});
      setStatus('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const validateEmail = useCallback(email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'نام باید حداقل 3 کاراکتر باشد.';
    }
    if (!formData.email.trim() || !validateEmail(formData.email.trim())) {
      newErrors.email = 'لطفاً ایمیل صحیح وارد کنید.';
    }
    if (!formData.question.trim() || formData.question.trim().length < 10) {
      newErrors.question = 'سوال باید حداقل 10 کاراکتر باشد.';
    }
    return newErrors;
  }, [formData, validateEmail]);

  const handleChange = useCallback(
    e => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();
      const newErrors = validate();
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setStatus('error');
        return;
      }
      setIsSubmitting(true);
      setErrors({});
      setStatus('');
      try {
        const res = await fetch('/api/contact/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            question: formData.question.trim(),
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          console.error('Server error:', data);
          setStatus('failed');
          return;
        }

        setStatus('success');
        setFormData({ name: '', email: '', question: '' });
        setTimeout(() => {
          if (typeof onClose === 'function') onClose();
        }, 2500);
      } catch (err) {
        console.error('Submit error:', err);
        setStatus('failed');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validate, onClose]
  );

  if (!isOpen) return null;

  return (
    <div
      id="ask-question"
      className="bg-white border-blue-50 border rounded-2xl shadow-lg p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="relative inline-flex items-center justify-center w-10 h-10">
            <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 opacity-90"></span>
            <span className="relative text-white text-xl font-extrabold drop-shadow">
              ?
            </span>
          </span>
          <h3 className="text-lg md:text-xl font-bold text-blue-800">
            سوال جدید بپرسید:
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-blue-500 hover:text-blue-700 transition-colors"
          aria-label="بستن فرم سوال"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {status === 'success' && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
          role="alert"
        >
          <span>✅</span>
          <span>سوال شما ثبت شد و به زودی بررسی می‌شود.</span>
        </div>
      )}
      {status === 'error' && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
          role="alert"
        >
          <span>❌</span>
          <span>لطفاً خطاهای فرم را اصلاح کنید.</span>
        </div>
      )}
      {status === 'failed' && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2"
          role="alert"
        >
          <span>⚠️</span>
          <span>خطا در ارسال! لطفاً دوباره تلاش کنید.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="ask-name"
              className="block text-blue-700 font-medium mb-2 pr-1.5"
            >
              نام *
            </label>
            <input
              id="ask-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.name ? 'border-red-500 bg-red-50' : 'border-blue-300'}`}
            />
            {errors.name && (
              <p className="text-red-600 text-sm mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="ask-email"
              className="block text-blue-700 font-medium mb-2 pr-1.5"
            >
              ایمیل *
            </label>
            <input
              id="ask-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500 bg-red-50' : 'border-blue-300'}`}
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="ask-question-text"
            className="block text-blue-700 font-medium mb-2 pr-1.5"
          >
            متن سوال *
          </label>
          <textarea
            id="ask-question-text"
            name="question"
            rows="4"
            value={formData.question}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.question ? 'border-red-500 bg-red-50' : 'border-blue-300'}`}
          />
          {errors.question && (
            <p className="text-red-600 text-sm mt-1">{errors.question}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn-primary-sm w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? 'در حال ارسال...' : 'ارسال سوال'}
        </button>
      </form>
    </div>
  );
};

export default AskQuestionForm;
