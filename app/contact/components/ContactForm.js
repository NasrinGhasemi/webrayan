// app/contact/components/ContactForm.js
'use client';
import { useState, useCallback } from 'react';
import CustomSelect from './CustomSelect';

const ContactForm = ({ onSubmitStatusChange, submitStatus }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    projectType: 'website',
    budget: '',
    priority: 'medium',
    timeline: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation functions
  const validateEmail = useCallback(email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }, []);

  const validatePhone = useCallback(phone => {
    const phoneRegex = /^(\+98|0)?9\d{9}$/;
    return phoneRegex.test(phone.replace(/[-\s]/g, ''));
  }, []);

  const validateName = useCallback(name => {
    const nameRegex = /^[\u0600-\u06FFa-zA-Z\s]+$/;
    return nameRegex.test(name) && name.trim().length >= 2;
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'وارد کردن نام الزامی است.';
    } else if (!validateName(formData.name.trim())) {
      newErrors.name =
        'نام باید شامل حروف فارسی یا انگلیسی باشد و حداقل 2 کاراکتر داشته باشد.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'وارد کردن ایمیل الزامی است.';
    } else if (!validateEmail(formData.email.trim())) {
      newErrors.email = 'فرمت ایمیل صحیح نیست.';
    }

    if (formData.phone.trim() && !validatePhone(formData.phone.trim())) {
      newErrors.phone = 'شماره موبایل صحیح نیست. (مثال: 09166530931)';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'وارد کردن موضوع الزامی است.';
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = 'موضوع باید حداقل 5 کاراکتر باشد.';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'وارد کردن شرح پروژه الزامی است.';
    } else if (formData.message.trim().length < 20) {
      newErrors.message = 'شرح پروژه باید حداقل 20 کاراکتر باشد.';
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'شرح پروژه نباید بیش از 1000 کاراکتر باشد.';
    }

    return newErrors;
  }, [formData, validateName, validateEmail, validatePhone]);

  const handleChange = useCallback(
    e => {
      const { name, value } = e.target;

      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));

      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: '',
        }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();

      const newErrors = validateForm();

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        onSubmitStatusChange('error');
        return;
      }

      setIsSubmitting(true);
      setErrors({});

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            subject: formData.subject.trim(),
            message: formData.message.trim(),
            phone: formData.phone.trim(),
            projectType: formData.projectType,
            budget: formData.budget,
            priority: formData.priority,
            timeline: formData.timeline,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          if (res.status === 429) {
            setErrors({
              submit: `خیلی سریع درخواست فرستادید. لطفاً ${Math.ceil((new Date(res.headers.get('X-RateLimit-Reset')) - new Date()) / 60000)} دقیقه صبر کنید.`,
            });
          } else if (res.status === 400 && data.fields) {
            const serverErrors = {};
            if (data.message.includes('نام')) serverErrors.name = data.message;
            if (data.message.includes('ایمیل'))
              serverErrors.email = data.message;
            if (data.message.includes('موضوع'))
              serverErrors.subject = data.message;
            if (data.message.includes('پیام'))
              serverErrors.message = data.message;
            setErrors(serverErrors);
          } else {
            setErrors({ submit: data?.message || 'ارسال با خطا مواجه شد!' });
          }
          onSubmitStatusChange('failed');
          return;
        }

        onSubmitStatusChange('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          projectType: 'website',
          budget: '',
          priority: 'medium',
          timeline: '',
        });

        console.log('✅ Contact form submitted successfully:', data.id);
      } catch (error) {
        console.error('❌ Contact form error:', error);
        setErrors({ submit: 'خطا در ارتباط با سرور، لطفاً دوباره تلاش کنید.' });
        onSubmitStatusChange('failed');
      } finally {
        setIsSubmitting(false);
      }
    },
    [validateForm, onSubmitStatusChange, formData]
  );

  return (
    <div className="bg-white border border-blue-100 rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">
        📝 فرم ثبت درخواست
      </h2>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div
          className="bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-lg mb-6"
          role="alert"
        >
          ✅ پیام شما با موفقیت ارسال شد! تا 2 ساعت آینده پاسخ می‌دهیم.
        </div>
      )}

      {submitStatus === 'error' && (
        <div
          className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6"
          role="alert"
        >
          ❌ لطفاً خطاهای فرم را اصلاح کنید.
        </div>
      )}

      {submitStatus === 'failed' && (
        <div
          className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6"
          role="alert"
        >
          ⚠️ {errors.submit || 'خطا در ارسال پیام! لطفاً دوباره تلاش کنید.'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Name and Email */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-blue-700 mb-2"
            >
              نام و نام خانوادگی *
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3.5 text-blue-700 bg-white border rounded-lg
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                         transition-all duration-200 placeholder:text-blue-300 ${
                           errors.name
                             ? 'border-red-300 bg-red-50'
                             : 'border-blue-200 hover:border-blue-300'
                         }`}
              placeholder="نام خود را وارد کنید."
              aria-describedby={errors.name ? 'name-error' : undefined}
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name && (
              <p
                id="name-error"
                className="text-red-600 text-sm mt-1.5"
                role="alert"
              >
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-blue-700 mb-2"
            >
              ایمیل *
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3.5 text-blue-700 bg-white border rounded-lg
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                         transition-all duration-200 placeholder:text-blue-300 ${
                           errors.email
                             ? 'border-red-300 bg-red-50'
                             : 'border-blue-200 hover:border-blue-300'
                         }`}
              placeholder="info@example.com"
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={errors.email ? 'true' : 'false'}
            />
            {errors.email && (
              <p
                id="email-error"
                className="text-red-600 text-sm mt-1.5"
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>
        </div>

        {/* Phone and Project Type */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-blue-700 mb-2"
            >
              شماره تماس
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-3.5 text-blue-700 bg-white border rounded-lg
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                         transition-all duration-200 placeholder:text-blue-300 ${
                           errors.phone
                             ? 'border-red-300 bg-red-50'
                             : 'border-blue-200 hover:border-blue-300'
                         }`}
              placeholder="09123456789"
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              aria-invalid={errors.phone ? 'true' : 'false'}
            />
            {errors.phone && (
              <p
                id="phone-error"
                className="text-red-600 text-sm mt-1.5"
                role="alert"
              >
                {errors.phone}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="projectType"
              className="block text-sm font-semibold text-blue-700 mb-2"
            >
              نوع پروژه
            </label>
            <CustomSelect
              value={formData.projectType}
              onChange={handleChange}
              name="projectType"
            >
              <option value="ecommerce">فروشگاه آنلاین</option>
              <option value="personal">سایت شخصی</option>
              <option value="corporate">سایت شرکتی</option>
              <option value="educational">سایت آموزشی</option>
              <option value="news">سایت خبری</option>
              <option value="restaurant & cafe">سایت رستوران و کافه</option>
              <option value="other">سایر</option>
            </CustomSelect>
          </div>
        </div>

        {/* Subject and Budget */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-semibold text-blue-700 mb-2"
            >
              موضوع پیام *
            </label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`w-full px-4 py-3.5 text-blue-700 bg-white border rounded-lg
                         focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                         transition-all duration-200 placeholder:text-blue-300 ${
                           errors.subject
                             ? 'border-red-300 bg-red-50'
                             : 'border-blue-200 hover:border-blue-300'
                         }`}
              placeholder="درخواست طراحی سایت"
              aria-describedby={errors.subject ? 'subject-error' : undefined}
              aria-invalid={errors.subject ? 'true' : 'false'}
            />
            {errors.subject && (
              <p
                id="subject-error"
                className="text-red-600 text-sm mt-1.5"
                role="alert"
              >
                {errors.subject}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="budget"
              className="block text-sm font-semibold text-blue-700 mb-2"
            >
              بودجه تقریبی
            </label>
            <CustomSelect
              name="budget"
              value={formData.budget}
              onChange={handleChange}
            >
              <option value="">انتخاب کنید</option>
              <option value="5-10">5 تا 10 میلیون</option>
              <option value="10-25">10 تا 25 میلیون</option>
              <option value="25-50">25 تا 50 میلیون</option>
              <option value="50-100">50 تا 100 میلیون</option>
              <option value="over-100">بالای 100 میلیون</option>
              <option value="consultation">نیاز به مشاوره</option>
            </CustomSelect>
          </div>
        </div>

        {/* Priority and Timeline */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-semibold text-blue-700 mb-2"
            >
              اولویت پروژه
            </label>
            <CustomSelect
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">عادی (بیش از 2 ماه)</option>
              <option value="medium">متوسط (1-2 ماه)</option>
              <option value="high">فوری (کمتر از 1 ماه)</option>
              <option value="urgent">اورژانسی (کمتر از 2 هفته)</option>
            </CustomSelect>
          </div>

          <div>
            <label
              htmlFor="timeline"
              className="block text-sm font-semibold text-blue-700 mb-2"
            >
              زمان‌بندی مطلوب
            </label>
            <CustomSelect
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
            >
              <option value="">انتخاب کنید</option>
              <option value="asap">در اسرع وقت</option>
              <option value="1-month">تا 1 ماه</option>
              <option value="2-month">تا 2 ماه</option>
              <option value="3-month">تا 3 ماه</option>
              <option value="flexible">انعطاف‌پذیر</option>
            </CustomSelect>
          </div>
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-blue-700 mb-2"
          >
            شرح پروژه *
            <span className="text-xs text-blue-500 mr-2 font-normal">
              ({formData.message.length}/1000)
            </span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="6"
            maxLength="1000"
            className={`w-full px-4 py-3.5 text-blue-700 bg-white border rounded-lg
                       focus:border-blue-500 focus:ring-2 focus:ring-blue-100
                       transition-all duration-200 resize-none placeholder:text-blue-300 ${
                         errors.message
                           ? 'border-red-300 bg-red-50'
                           : 'border-blue-200 hover:border-blue-300'
                       }`}
            placeholder="جزئیات پروژه خود را شرح دهید..."
            aria-describedby={errors.message ? 'message-error' : 'message-help'}
            aria-invalid={errors.message ? 'true' : 'false'}
          ></textarea>
          {!errors.message && (
            <p id="message-help" className="text-xs text-blue-500 mt-1.5">
              💡 هرچه توضیحات کامل‌تر باشد، پیشنهاد دقیق‌تر خواهد بود.
            </p>
          )}
          {errors.message && (
            <p
              id="message-error"
              className="text-red-600 text-sm mt-1.5"
              role="alert"
            >
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`btn-primary w-full ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              در حال ارسال...
            </span>
          ) : (
            '🚀 ارسال فرم'
          )}
        </button>

        {!isSubmitting && (
          <p className="text-xs text-blue-500 text-center">
            با ارسال فرم، با قوانین سایت موافقت می کنید.
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;
